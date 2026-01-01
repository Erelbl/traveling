# Check and update .env.local script
$envPath = "c:\Users\dorel\traveling\.env.local"

Write-Host "`n=== Checking .env.local content ===" -ForegroundColor Cyan

if (Test-Path $envPath) {
    $content = Get-Content $envPath -Raw
    
    Write-Host "`nCurrent content:" -ForegroundColor Yellow
    Write-Host "Length: $($content.Length) characters"
    
    # Check what's present
    $hasDatabase = $content -match 'DATABASE_URL='
    $hasAuthSecret = $content -match 'AUTH_SECRET='
    $hasResendKey = $content -match 'AUTH_RESEND_KEY='
    
    Write-Host "`nVariables found:" -ForegroundColor Yellow
    Write-Host "  DATABASE_URL: $(if($hasDatabase){'✓'}else{'✗'})"
    Write-Host "  AUTH_SECRET: $(if($hasAuthSecret){'✓'}else{'✗'})"
    Write-Host "  AUTH_RESEND_KEY: $(if($hasResendKey){'✓'}else{'✗'})"
    
    # Show actual content (safely)
    Write-Host "`nActual lines:" -ForegroundColor Yellow
    $lines = $content -split "`n"
    foreach ($line in $lines) {
        if ($line -match '^[A-Z_]+=') {
            # Mask the value
            $parts = $line -split '=', 2
            if ($parts.Length -eq 2) {
                $key = $parts[0]
                $value = $parts[1]
                if ($value.Length -gt 20) {
                    Write-Host "  $key=$($value.Substring(0,20))..." -ForegroundColor Green
                } else {
                    Write-Host "  $key=$value" -ForegroundColor Green
                }
            }
        }
    }
} else {
    Write-Host "❌ File does not exist!" -ForegroundColor Red
}

Write-Host ""

