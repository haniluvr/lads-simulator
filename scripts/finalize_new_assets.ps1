Write-Host "Waiting for all ffmpeg conversions to complete..."
while (Get-Process ffmpeg -ErrorAction SilentlyContinue) {
    Start-Sleep -Seconds 10
}

Write-Host "Cleaning up original uncompressed files..."
Remove-Item -Path "assets\sylus\five-star\lunar\limited\no defense zone.mov" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "assets\xavier\four-star\lunar\beachside victory.PNG" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "assets\zayne\four-star\lunar\your voice.PNG" -Force -ErrorAction SilentlyContinue

Write-Host "Rebuilding catalog..."
node build_catalog.js

Write-Host "Done! The new cards are now successfully integrated."
