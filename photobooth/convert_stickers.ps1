$dir = "C:\Users\admin\Documents\projects\personal projects\pseudo-gacha\photobooth\assets\stickers\valko"
Get-ChildItem -Path $dir -Filter "valko (*).*" | Where-Object { $_.Extension -match "(?i)\.png$" } | ForEach-Object {
    if ($_.Name -match "(?i)^valko \((.*?)\)\.png$") {
        $num = $matches[1]
        $newName = "valko_${num}.webp"
        $newPath = Join-Path $_.Directory $newName
        Write-Host "Converting $($_.Name) to $newName"
        ffmpeg -i $_.FullName -c:v libwebp -lossless 1 $newPath -y -v quiet
        if ($?) {
            Remove-Item $_.FullName
        }
    }
}
