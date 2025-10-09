# Update Render Environment Variables with Supabase
$ErrorActionPreference = 'Stop'

$renderToken = 'rnd_JrFfL5Lj9ObEyKtKVbfsGz2u6gQg'
$backendServiceId = 'srv-d3f8ckfdiees73ctv2tg'
$frontendServiceId = 'srv-d3f8es63jp1c73c723d0'

$supabaseUrl = 'https://tirfsghvgyaubcqwsliq.supabase.co'
$supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcmZzZ2h2Z3lhdWJjcXdzbGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDMwMzEsImV4cCI6MjA3NTUxOTAzMX0.og0dtM0WivwkdTuAUCXIJB9vub6yCTSzEfty5YgI77s'
$supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcmZzZ2h2Z3lhdWJjcXdzbGlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk0MzAzMSwiZXhwIjoyMDc1NTE5MDMxfQ.8bX5o1QIgP7qGjLvoSv5DXMo9P5L0JcJdPBMzLZbSpI'

$headers = @{
    'Authorization' = "Bearer $renderToken"
    'Content-Type' = 'application/json'
}

# Backend env vars (remove DATABASE_URL, add Supabase)
$backendEnvVars = @(
    @{ key = 'NODE_ENV'; value = 'production' }
    @{ key = 'PORT'; value = '10000' }
    @{ key = 'JWT_SECRET'; value = 'Ra7ba_JWT_S3cr3t_2024_Change_This_Now!' }
    @{ key = 'JWT_REFRESH_SECRET'; value = 'Ra7ba_R3fr3sh_S3cr3t_2024_Change_This_Now!' }
    @{ key = 'JWT_EXPIRES_IN'; value = '1h' }
    @{ key = 'JWT_REFRESH_EXPIRES_IN'; value = '7d' }
    @{ key = 'ADMIN_DEFAULT_EMAIL'; value = 'ra7baa1@gmail.com' }
    @{ key = 'ADMIN_DEFAULT_PASSWORD'; value = 'abdo154122!ChangeMe' }
    @{ key = 'FRONTEND_URL'; value = 'https://ra7ba-1.onrender.com' }
    @{ key = 'NEXT_PUBLIC_IMGBB_KEY'; value = '1e8a000028996d5fffbddaaa0a8049ae' }
    @{ key = 'SUPABASE_URL'; value = $supabaseUrl }
    @{ key = 'NEXT_PUBLIC_SUPABASE_URL'; value = $supabaseUrl }
    @{ key = 'SUPABASE_SERVICE_ROLE_KEY'; value = $supabaseServiceRoleKey }
    @{ key = 'NEXT_PUBLIC_SUPABASE_ANON_KEY'; value = $supabaseAnonKey }
)

# Frontend env vars (add Supabase)
$frontendEnvVars = @(
    @{ key = 'NODE_ENV'; value = 'production' }
    @{ key = 'NEXT_PUBLIC_API_URL'; value = 'https://ra7ba.onrender.com/api' }
    @{ key = 'NEXT_PUBLIC_APP_NAME'; value = 'Ra7ba' }
    @{ key = 'NEXT_PUBLIC_SUPABASE_URL'; value = $supabaseUrl }
    @{ key = 'NEXT_PUBLIC_SUPABASE_ANON_KEY'; value = $supabaseAnonKey }
)

Write-Host "Updating Backend environment variables..." -ForegroundColor Cyan
$backendBody = @($backendEnvVars) | ConvertTo-Json -Depth 3
Invoke-RestMethod -Method PUT -Uri "https://api.render.com/v1/services/$backendServiceId/env-vars" -Headers $headers -Body $backendBody
Write-Host "✓ Backend env vars updated" -ForegroundColor Green

Write-Host "Updating Frontend environment variables..." -ForegroundColor Cyan
$frontendBody = @($frontendEnvVars) | ConvertTo-Json -Depth 3
Invoke-RestMethod -Method PUT -Uri "https://api.render.com/v1/services/$frontendServiceId/env-vars" -Headers $headers -Body $frontendBody
Write-Host "✓ Frontend env vars updated" -ForegroundColor Green

Write-Host ""
Write-Host "All environment variables updated successfully!" -ForegroundColor Green
Write-Host "Services will redeploy automatically." -ForegroundColor Yellow
