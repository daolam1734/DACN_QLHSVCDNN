# Test Dashboard Access

Write-Host "=== TESTING DASHBOARD ACCESS ===" -ForegroundColor Cyan

# 1. Login
Write-Host "`n[1] Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@tvu.edu.vn"
    password = "Admin@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    if ($loginResponse.success) {
        Write-Host "✓ Login successful!" -ForegroundColor Green
        $token = $loginResponse.token
        Write-Host "Token: $($token.Substring(0,30))..." -ForegroundColor Gray
        
        # 2. Test Dashboard Summary API
        Write-Host "`n[2] Testing Dashboard Summary API..." -ForegroundColor Yellow
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $summary = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/admin/summary" `
            -Method GET `
            -Headers $headers
        
        Write-Host "✓ Dashboard API Response:" -ForegroundColor Green
        $summary | ConvertTo-Json -Depth 3
        
        Write-Host "`n✓ Dashboard accessible! Open: http://localhost:3000/dashboard" -ForegroundColor Green
    } else {
        Write-Host "✗ Login failed: $($loginResponse.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
