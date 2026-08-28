$assetsDir = "C:\Users\admin\Documents\projects\personal projects\pseudo-gacha\assets"

# Find all 3-star and 4-star .png, .jpg, .jpeg files recursively
$imageFiles = Get-ChildItem -Path $assetsDir -Recurse -Include *.png,*.jpg,*.jpeg | Where-Object { $_.FullName -match "three-star|four-star" }

if ($imageFiles.Count -eq 0) {
    Write-Host "No image files found to compress!"
    exit
}

Write-Host "Found $($imageFiles.Count) image files to compress to WebP..."

$ffmpegPath = "C:\Users\admin\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"

$i = 1
foreach ($file in $imageFiles) {
    $webpPath = [System.IO.Path]::ChangeExtension($file.FullName, ".webp")
    
    Write-Host "[$i/$($imageFiles.Count)] Compressing: $($file.Name)"
    
    # Run ffmpeg to convert to webp
    # -c:v libwebp : Use WebP codec
    # -lossless 0 : Lossy compression
    # -q:v 75 : Quality factor (0-100, 75 is usually a good balance)
    $ffmpegArgs = "-y", "-i", "`"$($file.FullName)`"", "-c:v", "libwebp", "-lossless", "0", "-q:v", "75", "`"$webpPath`""
    
    $process = Start-Process -FilePath $ffmpegPath -ArgumentList $ffmpegArgs -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "SUCCESS: $($file.Name) converted." -ForegroundColor Green
        # Delete original image
        Remove-Item -Path $file.FullName -Force
    } else {
        Write-Host "FAILED: Could not convert $($file.Name)" -ForegroundColor Red
    }
    
    $i++
}

Write-Host "---------------------------------------------------"
Write-Host "All done! Images compressed to WebP and old files deleted."
