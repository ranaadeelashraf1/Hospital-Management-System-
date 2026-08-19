<#
PowerShell script to initialize a git repo, add remote, commit, and push.
- Uses Urdu commit message (no Roman letters).
- It will prompt for GitHub credentials if needed.
Run from the repository root in PowerShell.
#>

$repoUrl = 'https://github.com/ranaadeelashraf1/Hospital-Management-System-.git'
$branch = 'main'
$commitMsg = 'Initial commit: Project upload'

Write-Host "Repository URL: $repoUrl"
Write-Host "Target branch: $branch"

# Check git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git is not installed or not in PATH. Install git and rerun."
    exit 1
}

# Initialize repo if needed
if (!(Test-Path .git)) {
    git init
    Write-Host "Initialized empty git repository." -ForegroundColor Green
} else {
    Write-Host ".git already exists. Using existing repository." -ForegroundColor Yellow
}

# Set remote (replace existing origin)
try {
    git remote remove origin 2>$null
} catch { }

git remote add origin $repoUrl
Write-Host "Remote 'origin' set to $repoUrl"

# Ensure all files are added
git add -A

# Create commit if there are changes
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    git commit -m "$commitMsg"
    Write-Host "Committed changes with message: $commitMsg" -ForegroundColor Green
}

# Create or rename branch and push
try {
    git branch -M $branch
    Write-Host "Branch set to $branch"
} catch { }

Write-Host "Pushing to remote. You may be prompted for credentials." -ForegroundColor Cyan
git push -u origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push succeeded." -ForegroundColor Green
} else {
    Write-Error "Push failed. Check authentication and remote permissions."
}
