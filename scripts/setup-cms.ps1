# CMS Development Setup Script (PowerShell)
# Run this script to set up the development environment for CMS features

Write-Host "Setting up CMS Development Environment..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if Sanity CLI is installed
try {
    $sanityVersion = sanity --version
    Write-Host "Sanity CLI is already installed: $sanityVersion" -ForegroundColor Green
} catch {
    Write-Host "Installing Sanity CLI..." -ForegroundColor Yellow
    npm install -g @sanity/cli
}

# Create .env.local if it doesn't exist
if (-not (Test-Path .env.local)) {
    Write-Host "Creating .env.local template..." -ForegroundColor Yellow
    @"
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-03-12
SANITY_API_READ_TOKEN=your-read-token
SANITY_API_WRITE_TOKEN=your-write-token
"@ | Out-File -FilePath .env.local -Encoding utf8
    Write-Host "Created .env.local template" -ForegroundColor Green
    Write-Host "Please update the environment variables with your Sanity project details" -ForegroundColor Yellow
} else {
    Write-Host ".env.local already exists" -ForegroundColor Green
}

# Test the current setup
Write-Host "Testing current setup..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
} else {
    Write-Host "Build failed. Please check the error messages above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your Sanity project details" -ForegroundColor White
Write-Host "2. Run 'sanity init' to create/connect to your Sanity project" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "4. Run 'npx sanity dev' to start the Sanity Studio" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see CMS_HANDOVER.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
