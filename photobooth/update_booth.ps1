$path = "booth.js"
$content = Get-Content $path -Raw

# Update phases object
$content = $content -replace "2: document\.getElementById\('phase-2'\),\s*3: document\.getElementById\('phase-3'\),\s*4: document\.getElementById\('phase-4'\),\s*5: document\.getElementById\('phase-5'\)", "2: document.getElementById('phase-2'),`r`n  3: document.getElementById('phase-3'),`r`n  4: document.getElementById('phase-4')"

# Update goToPhase calls
$content = $content -replace "goToPhase\(3\)", "goToPhase(2)"
$content = $content -replace "goToPhase\(4\)", "goToPhase(3)"
$content = $content -replace "goToPhase\(5\)", "goToPhase(4)"

# Update initPhase numbers in goToPhase function
$content = $content -replace "if \(n === 3\) initPhase3\(\);", "if (n === 2) initPhase2();"
$content = $content -replace "if \(n === 4\) initPhase4\(\);", "if (n === 3) initPhase3();"
$content = $content -replace "if \(n === 5\) initPhase5\(\);", "if (n === 4) initPhase4();"

# Update function names
$content = $content -replace "function initPhase3\(\)", "function initPhase2()"
$content = $content -replace "async function initPhase4\(\)", "async function initPhase3()"
$content = $content -replace "function initPhase5\(\)", "function initPhase4()"

# Update phase state checks
$content = $content -replace "state\.phase === 3", "state.phase === 2"
$content = $content -replace "state\.phase === 4", "state.phase === 3"
$content = $content -replace "state\.phase === 5", "state.phase === 4"

Set-Content $path $content
