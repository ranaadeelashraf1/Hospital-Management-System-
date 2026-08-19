<#
Professional push script for MediCare HMS repository.
- Adds a sensible `.gitignore` if missing.
- Creates a minimal `README.md` if missing.
- Ensures `.env` is excluded.
- Initializes git if needed, sets `origin` remote, creates `main` branch, commits, and pushes.
- Uses a clear Urdu commit message (no Roman) and avoids force-pushing.

Usage: Run from the repository root in PowerShell:
    .\push_professional.ps1

If you prefer SSH remotes, set $repoUrl to your SSH URL (git@github.com:...)
#>

$repoUrl = 'https://github.com/ranaadeelashraf1/Hospital-Management-System-.git'
$branch = 'main'
$commitMsg = 'Initial commit — MediCare HMS project upload'

function Ensure-File([string]$path, [string]$content) {
    if (!(Test-Path $path)) {
        $dir = Split-Path $path -Parent
        if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        Set-Content -Path $path -Value $content -Encoding UTF8
        Write-Host "Created $path" -ForegroundColor Green
    } else {
        Write-Host "$path already exists" -ForegroundColor Yellow
    }
}

# Check git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "git is not installed or not in PATH. Install git and rerun."
    exit 1
}

# Create .gitignore
$gitignoreContent = @"
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
pnpm-lock.yaml
.DS_Store
.env
.env.local
.env.*.local
.vscode/
dist/
build/
coverage/
.idea/

# Prisma
prisma/migrations/

# Logs
logs
*.log
"@
Ensure-File -path '.gitignore' -content $gitignoreContent

# Create minimal README
$readmeContent = @"
# MediCare HMS

Full-stack Hospital Management System (React + Node + Prisma + PostgreSQL).

Run the setup steps in `SETUP.md`.
"@
Ensure-File -path 'README.md' -content $readmeContent

# Initialize repo if needed
if (!(Test-Path .git)) {
    git init
    Write-Host "Initialized git repository." -ForegroundColor Green
} else {
    Write-Host ".git already present." -ForegroundColor Yellow
}

# Ensure .env is ignored
if ((Test-Path '.env') -and ((Select-String -Path .gitignore -Pattern "^\.env$" -SimpleMatch -Quiet) -eq $false)) {
    Add-Content -Path .gitignore -Value "`n.env"
    Write-Host "Added .env to .gitignore" -ForegroundColor Green
}

# Set remote (replace existing origin)
try { git remote remove origin 2>$null } catch { }

git remote add origin $repoUrl
Write-Host "Remote 'origin' set to $repoUrl" -ForegroundColor Cyan

# Stage changes
git add -A

# Commit if there are changes
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    git commit -m "$commitMsg"
    Write-Host "Committed changes with message: $commitMsg" -ForegroundColor Green
}

# Create or rename branch
try { git branch -M $branch } catch { }

# Push
Write-Host "Pushing to origin/$branch. You may be prompted for credentials." -ForegroundColor Cyan
$push = git push -u origin $branch
if ($LASTEXITCODE -eq 0) { Write-Host "Push succeeded." -ForegroundColor Green } else { Write-Error "Push failed (exit code $LASTEXITCODE). Check authentication/permissions." }

Write-Host @"
Next steps (recommended):
- Enable branch protection and require PRs on GitHub.
- Add a LICENSE if needed (e.g., MIT).
- Configure CI (GitHub Actions) for tests/builds.
"@