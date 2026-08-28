$assetsDir = "C:\Users\admin\Documents\projects\personal projects\pseudo-gacha\assets"

Write-Host "Searching for .mp4 files in $assetsDir..."
$mp4Files = Get-ChildItem -Path $assetsDir -Filter "*.mp4" -Recurse

if ($mp4Files.Count -eq 0) {
    Write-Host "No .mp4 files found!"
    exit
}

Write-Host "Found $($mp4Files.Count) video files to process. Starting compression..."

$totalOriginalSize = 0
$totalNewSize = 0

foreach ($file in $mp4Files) {
    $tempPath = [System.IO.Path]::ChangeExtension($file.FullName, ".compressed.mp4")
    $originalSize = $file.Length
    $totalOriginalSize += $originalSize
    
    Write-Host "`nProcessing: $($file.Name) ($([math]::Round($originalSize / 1MB, 2)) MB)"
    
    # We use CRF 28 for good compression, fast preset for speed, and we keep audio as AAC 128k
    $ffmpegArgs = "-y", "-i", "`"$($file.FullName)`"", "-c:v", "libx264", "-crf", "28", "-preset", "fast", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "`"$tempPath`""
    
    $process = Start-Process -FilePath "ffmpeg" -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0 -and (Test-Path $tempPath)) {
        $newSize = (Get-Item $tempPath).Length
        $totalNewSize += $newSize
        
        # Overwrite original with the compressed version
        Remove-Item -Path $file.FullName -Force
        Move-Item -Path $tempPath -Destination $file.FullName -Force
        
        Write-Host "SUCCESS: $($file.Name) compressed from $([math]::Round($originalSize / 1MB, 2)) MB -> $([math]::Round($newSize / 1MB, 2)) MB" -ForegroundColor Green
    } else {
        Write-Host "FAILED: Could not compress $($file.Name)" -ForegroundColor Red
        if (Test-Path $tempPath) {
            Remove-Item -Path $tempPath -Force
        }
    }
}

Write-Host "`n==============================================="
Write-Host "Compression Complete!"
Write-Host "Total Original Size: $([math]::Round($totalOriginalSize / 1MB, 2)) MB"
Write-Host "Total New Size: $([math]::Round($totalNewSize / 1MB, 2)) MB"
Write-Host "Total Space Saved: $([math]::Round(($totalOriginalSize - $totalNewSize) / 1MB, 2)) MB"
Write-Host "==============================================="
