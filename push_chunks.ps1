# push_chunks.ps1

Write-Host "Resetting current index..."
git reset HEAD

Write-Host "Adding and pushing core files..."
# Add core web files first
git add index.html style.css app.js build_catalog.js cards.js .gitattributes compress.ps1
git commit -m "Update UI and logic to use mp4 videos"
git push

Write-Host "Fetching list of all untracked mp4 files..."
# Find all untracked .mp4 files
$mp4Files = Get-ChildItem -Path "assets" -Recurse -Filter "*.mp4" | Select-Object -ExpandProperty FullName

$batchSize = 20
$totalFiles = $mp4Files.Count
$batchCount = [Math]::Ceiling($totalFiles / $batchSize)

Write-Host "Found $totalFiles mp4 files. Pushing in $batchCount batches..."

for ($i = 0; $i -lt $batchCount; $i++) {
    $startIndex = $i * $batchSize
    $endIndex = [Math]::Min((($i + 1) * $batchSize) - 1, $totalFiles - 1)
    
    $batch = $mp4Files[$startIndex..$endIndex]
    
    Write-Host "Batch $($i + 1) out of $batchCount - Adding $($batch.Count) files..."
    
    foreach ($file in $batch) {
        # Add files one by one to avoid command line length limits
        git add "`"$file`""
    }
    
    Write-Host "Committing Batch $($i + 1)..."
    git commit -m "Add video assets chunk $($i + 1) of $batchCount"
    
    Write-Host "Pushing Batch $($i + 1)..."
    $pushResult = git push
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error pushing batch $($i + 1)! Check your connection." -ForegroundColor Red
        exit
    }
    
    Write-Host "Batch $($i + 1) pushed successfully!" -ForegroundColor Green
}

# Add any remaining stray files (like images in assets)
Write-Host "Pushing any remaining images or tiny assets..."
git add .
git commit -m "Add remaining assets"
git push

Write-Host "All done! Repository fully synced to GitHub."
