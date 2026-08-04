$files = Get-ChildItem "public/video-background/*.mp4"
foreach ($f in $files) {
    $d = & ffprobe -v error -show_entries format=duration -of csv=p=0 $f.FullName
    Write-Output ($f.Name + " = " + $d + "s")
}
