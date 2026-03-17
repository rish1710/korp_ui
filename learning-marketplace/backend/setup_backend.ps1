# KORP Backend Setup Script for Windows
Write-Host "Setting up KORP Backend..." -ForegroundColor Cyan

# Check for Python
$pythonCmd = "python"
try {
    & $pythonCmd --version
} catch {
    $pythonCmd = "python3"
    try {
        & $pythonCmd --version
    } catch {
        # Fallback to the Windows Store path found in logs
        $pythonCmd = "$env:LOCALAPPDATA\Microsoft\WindowsApps\python3.13.exe"
    }
}

Write-Host "Using Python command: $pythonCmd" -ForegroundColor Green

# 1. Install dependencies
Write-Host "Installing dependencies... This may take a minute." -ForegroundColor Yellow
& $pythonCmd -m pip install -r requirements.txt

# 2. Download SpaCy model
Write-Host "Downloading SpaCy model (en_core_web_sm)..." -ForegroundColor Yellow
& $pythonCmd -m spacy download en_core_web_sm

Write-Host "Setup complete! Run 'uvicorn main:app --reload --port 8000' to start." -ForegroundColor Green
