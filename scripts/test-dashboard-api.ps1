# Dashboard Testing Script

Write-Host "=== DASHBOARD API TESTING ===" -ForegroundColor Cyan

# 1. Login để lấy token
Write-Host "`n[1] Đăng nhập với admin account..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{
        email = "admin@tvu.edu.vn"
        mat_khau = "Admin@123"
    } | ConvertTo-Json) `
    -ErrorAction Stop

$token = $loginResponse.token
Write-Host "✓ Login thành công! Token: $($token.Substring(0,20))..." -ForegroundColor Green

# Headers với token
$headers = @{
    Authorization = "Bearer $token"
}

# 2. Test Summary Endpoint
Write-Host "`n[2] Test /api/dashboard/admin/summary..." -ForegroundColor Yellow
try {
    $summary = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/admin/summary" `
        -Method GET `
        -Headers $headers
    Write-Host "✓ Summary Response:" -ForegroundColor Green
    $summary | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# 3. Test By Don Vi Endpoint
Write-Host "`n[3] Test /api/dashboard/admin/by-don-vi..." -ForegroundColor Yellow
try {
    $byDonVi = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/admin/by-don-vi" `
        -Method GET `
        -Headers $headers
    Write-Host "✓ By Don Vi Response ($($byDonVi.Count) records):" -ForegroundColor Green
    $byDonVi | Select-Object -First 3 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test Loai Ho So Endpoint
Write-Host "`n[4] Test /api/dashboard/admin/loai-ho-so..." -ForegroundColor Yellow
try {
    $loaiHoSo = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/admin/loai-ho-so" `
        -Method GET `
        -Headers $headers
    Write-Host "✓ Loai Ho So Response ($($loaiHoSo.Count) records):" -ForegroundColor Green
    $loaiHoSo | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test Recent Endpoint
Write-Host "`n[5] Test /api/dashboard/admin/recent?limit=5..." -ForegroundColor Yellow
try {
    $recent = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/admin/recent?limit=5" `
        -Method GET `
        -Headers $headers
    Write-Host "✓ Recent Response ($($recent.Count) records):" -ForegroundColor Green
    $recent | Select-Object -First 2 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Test Trend Endpoint
Write-Host "`n[6] Test /api/dashboard/admin/trend?months=6..." -ForegroundColor Yellow
try {
    $trend = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard/admin/trend?months=6" `
        -Method GET `
        -Headers $headers
    Write-Host "✓ Trend Response ($($trend.Count) months):" -ForegroundColor Green
    $trend | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTING COMPLETE ===" -ForegroundColor Cyan
