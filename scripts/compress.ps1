$assetsDir = "C:\Users\admin\Documents\projects\personal projects\pseudo-gacha\assets"

# Find all .mov files recursively in the assets directory
$movFiles = Get-ChildItem -Path $assetsDir -Filter "*.mov" -Recurse

if ($movFiles.Count -eq 0) {
    Write-Host "No .mov files found!"
    exit
}

Write-Host "Found $($movFiles.Count) video files to compress..."

foreach ($file in $movFiles) {
    # Define the new .mp4 filename
    $mp4Path = [System.IO.Path]::ChangeExtension($file.FullName, ".mp4")
    
    Write-Host "---------------------------------------------------"
    Write-Host "Compressing: $($file.Name)"
    
    # Run ffmpeg to convert to mp4 (H.264) with compression
    # -c:v libx264 : Use H.264 video codec (universal web support)
    # -crf 28 : Constant Rate Factor (28 is very high compression, looks good on web)
    # -preset veryfast : Encodes quickly
    # -c:a aac -b:a 128k : Compress audio
    $ffmpegArgs = "-y", "-i", "`"$($file.FullName)`"", "-c:v", "libx264", "-crf", "28", "-preset", "veryfast", "-c:a", "aac", "-b:a", "128k", "`"$mp4Path`""
    
    $ffmpegPath = "C:\Users\admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
    $process = Start-Process -FilePath $ffmpegPath -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "SUCCESS: $($file.Name) compressed." -ForegroundColor Green
        # Delete the original .mov to save space
        Remove-Item -Path $file.FullName -Force
    } else {
        Write-Host "FAILED: Could not compress $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "---------------------------------------------------"
Write-Host "All done! Videos compressed and old files deleted."
