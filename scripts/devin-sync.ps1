<#
.SYNOPSIS
  Apply a patch exported from a Devin cloud session and push it to the remote.

.DESCRIPTION
  Devin's cloud VM sometimes cannot push (git write-proxy returns 403). In that
  case Devin exports the changes as a .patch file. Run this script locally to
  apply that patch onto your branch and push with YOUR own GitHub credentials
  (which do not go through Devin's proxy).

  Steps performed:
    1. Verify current dir is a git work tree.
    2. Require a clean working tree (will NOT auto-stash).
    3. Locate the patch (explicit -PatchPath, else newest *.patch in repo root / Downloads).
    4. checkout <Branch>; pull --ff-only.
    5. git apply --check, then apply + commit (or `git am` if it is a mailbox patch).
    6. push <Remote> <Branch>.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\devin-sync.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\devin-sync.ps1 -PatchPath "$HOME\Downloads\LFVideo-cloud-changes.patch" -Branch main
#>
[CmdletBinding()]
param(
    [string]$PatchPath = "",
    [string]$Branch    = "main",
    [string]$Remote    = "origin",
    [string]$Message   = "sync from devin via patch"
)

$ErrorActionPreference = "Stop"

function Fail($msg) { Write-Host "[devin-sync] ERROR: $msg" -ForegroundColor Red; exit 1 }
function Step($msg) { Write-Host "[devin-sync] $msg" -ForegroundColor Cyan }

# 1. Must be inside a git work tree
& git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) { Fail "Not inside a git repository. cd into your repo first." }

$repoRoot = (& git rev-parse --show-toplevel).Trim()
Step "Repo root: $repoRoot"

# 2. Require clean working tree
$dirty = & git status --porcelain
if ($dirty) {
    Write-Host $dirty
    Fail "Working tree is not clean. Commit/stash your changes first (script will not auto-stash)."
}

# 3. Locate patch
if (-not $PatchPath -or -not (Test-Path $PatchPath)) {
    Step "No valid -PatchPath given; searching for newest *.patch ..."
    $candidates = @()
    $candidates += Get-ChildItem -Path $repoRoot -Filter *.patch -ErrorAction SilentlyContinue
    $dl = Join-Path $HOME "Downloads"
    if (Test-Path $dl) { $candidates += Get-ChildItem -Path $dl -Filter *.patch -ErrorAction SilentlyContinue }
    $newest = $candidates | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $newest) { Fail "No .patch file found in '$repoRoot' or '$dl'. Download the patch there and retry." }
    $PatchPath = $newest.FullName
}
Step "Using patch: $PatchPath"

# 4. Sync branch
Step "Checking out '$Branch' and pulling (ff-only) ..."
& git checkout $Branch; if ($LASTEXITCODE -ne 0) { Fail "git checkout $Branch failed." }
& git pull --ff-only;   if ($LASTEXITCODE -ne 0) { Fail "git pull --ff-only failed (branch diverged?)." }

# 5. Apply
Step "Validating patch with git apply --check ..."
& git apply --check -- "$PatchPath" 2>$null
$applyOk = ($LASTEXITCODE -eq 0)

if ($applyOk) {
    Step "Applying patch and committing ..."
    & git apply -- "$PatchPath"; if ($LASTEXITCODE -ne 0) { Fail "git apply failed unexpectedly." }
    & git add -A;                if ($LASTEXITCODE -ne 0) { Fail "git add failed." }
    & git commit -m $Message;    if ($LASTEXITCODE -ne 0) { Fail "git commit failed (nothing to commit? maybe already synced)." }
} else {
    Step "git apply --check failed; trying 'git am' (mailbox patch) ..."
    & git am -- "$PatchPath"
    if ($LASTEXITCODE -ne 0) {
        & git am --abort 2>$null
        Fail "Patch did not apply via 'git apply' or 'git am'. It may already be applied, or the base branch differs. Inspect manually with: git apply --reject -- `"$PatchPath`""
    }
}

& git log --oneline -3

# 6. Push
Step "Pushing to $Remote/$Branch ..."
& git push $Remote $Branch
if ($LASTEXITCODE -ne 0) { Fail "git push failed. Check your credentials / network." }

Step "Done. Latest commits:"
& git log --oneline -3
Write-Host "[devin-sync] SUCCESS: pushed to $Remote/$Branch" -ForegroundColor Green
