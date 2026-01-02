# Stop all Node.js processes
Write-Host "🛑 Stopping all Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Killing PID: $($_.Id)" -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force
}

# Remove .next directory
Write-Host "🗑️  Removing .next directory..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Wait a moment
Write-Host "⏳ Waiting for cleanup..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Check if port 3000 is free
Write-Host "🔍 Checking port 3000..." -ForegroundColor Yellow
$port3000 = netstat -ano | findstr :3000
if ($port3000) {
    Write-Host "⚠️  Port 3000 is still in use!" -ForegroundColor Red
    Write-Host $port3000
} else {
    Write-Host "✅ Port 3000 is free!" -ForegroundColor Green
}

# Start the dev server
Write-Host "🚀 Starting dev server..." -ForegroundColor Green
npm run dev

