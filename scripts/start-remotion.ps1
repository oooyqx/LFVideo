$ErrorActionPreference = 'Stop'
$projectDir = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\OpenMontage\remotion-composer'))
$url = 'http://localhost:3000'

function Test-RemotionStudio {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    } catch {
        return $false
    }
}

try {
    if (Test-RemotionStudio) {
        Start-Process $url
        exit 0
    }

    $process = Start-Process -FilePath $env:ComSpec -ArgumentList '/d', '/c', 'npm start' -WorkingDirectory $projectDir -PassThru -NoNewWindow
    $opened = $false

    for ($attempt = 0; $attempt -lt 120; $attempt++) {
        if (Test-RemotionStudio) {
            Start-Process $url
            $opened = $true
            break
        }

        if ($process.HasExited) {
            throw "Remotion exited before the Studio was ready (exit code $($process.ExitCode))."
        }

        Start-Sleep -Seconds 1
    }

    if (-not $opened) {
        throw 'Timed out waiting for Remotion Studio at http://localhost:3000.'
    }

    $process.WaitForExit()
    exit $process.ExitCode
} catch {
    Write-Host "`nFailed to start Remotion Studio: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
}