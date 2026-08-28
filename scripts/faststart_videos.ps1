$assetsDir = "C:\Users\admin\Documents\projects\personal projects\pseudo-gacha\assets"

# Find all .mp4 files recursively
$mp4Files = Get-ChildItem -Path $assetsDir -Filter "*.mp4" -Recurse

if ($mp4Files.Count -eq 0) {
    Write-Host "No .mp4 files found!"
    exit
}

Write-Host "Found $($mp4Files.Count) video files to process..."

foreach ($file in $mp4Files) {
    # We need a temporary file name since ffmpeg cannot edit in-place
    $tempPath = [System.IO.Path]::ChangeExtension($file.FullName, ".temp.mp4")
    
    Write-Host "Processing: $($file.Name)"
    
    # Run ffmpeg to faststart (lossless copy)
    $ffmpegArgs = "-y", "-i", "`"$($file.FullName)`"", "-c", "copy", "-movflags", "+faststart", "`"$tempPath`""
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        # Overwrite original with the faststart version
        Move-Item -Path $tempPath -Destination $file.FullName -Force
        Write-Host "SUCCESS: $($file.Name) updated for faststart." -ForegroundColor Green
    } else {
        Write-Host "FAILED: Could not process $($file.Name)" -ForegroundColor Red
        if (Test-Path $tempPath) {
            Remove-Item -Path $tempPath -Force
        }
    }
}

Write-Host "Done!"
