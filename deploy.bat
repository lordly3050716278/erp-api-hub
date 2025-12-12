@echo off
chcp 65001 >nul
setlocal

:: ======================
:: 设置路径和远程主机信息
set DIST_DIR=dist
set SERVER_USER=root
set SERVER_HOST=120.26.137.113
set SERVER_PATH=/lordly/erp-api-hub
:: ======================

echo 🔧 Packing the project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed. Exiting script.
    pause
    exit /b %errorlevel%
)

echo ✅ Build completed. Preparing to upload files to server...

:: 检查是否存在 scp 命令
where scp >nul 2>nul
if errorlevel 1 (
    echo ❌ Cannot find 'scp' command. Please install Git or OpenSSH.
    pause
    exit /b 1
)

:: 检查远程部署目录是否存在，不存在则创建
echo 📁 Checking if remote directory exists: "%SERVER_PATH%"
ssh %SERVER_USER%@%SERVER_HOST% "if [ ! -d %SERVER_PATH% ]; then mkdir -p %SERVER_PATH%; fi"
if %errorlevel% neq 0 (
    echo ❌ Failed to verify or create remote base directory.
    pause
    exit /b %errorlevel%
)

:: 创建 dist 子目录并清空旧文件
echo 🧹 Cleaning remote dist directory: "%SERVER_PATH%/dist"
ssh %SERVER_USER%@%SERVER_HOST% "mkdir -p %SERVER_PATH%/dist && rm -rvf %SERVER_PATH%/dist/*"
if %errorlevel% neq 0 (
    echo ❌ Failed to clean dist directory.
    pause
    exit /b %errorlevel%
)

:: 上传 dist 文件夹
echo 🚀 Uploading "%DIST_DIR%\*" to "%SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%/dist"
scp -r %DIST_DIR%\* %SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%/dist
if %errorlevel% neq 0 (
    echo ❌ Failed to upload dist folder.
    pause
    exit /b %errorlevel%
)

:: 上传 package.json
echo 📦 Uploading "package.json" to "%SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%"
scp package.json %SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%
if %errorlevel% neq 0 (
    echo ❌ Failed to upload package.json
    pause
    exit /b %errorlevel%
)

:: 上传 package-lock.json
echo 📦 Uploading "package-lock.json" to "%SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%"
scp package-lock.json %SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%
if %errorlevel% neq 0 (
    echo ❌ Failed to upload package-lock.json
    pause
    exit /b %errorlevel%
)

:: 上传 .env 文件
echo 📦 Uploading ".env" to "%SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%"
scp .env %SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%
if %errorlevel% neq 0 (
    echo ❌ Failed to upload .env
    pause
    exit /b %errorlevel%
)

:: 上传 .env.production 文件
echo 📦 Uploading ".env.production" to "%SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%"
scp .env.production %SERVER_USER%@%SERVER_HOST%:%SERVER_PATH%
if %errorlevel% neq 0 (
    echo ❌ Failed to upload .env.production
    pause
    exit /b %errorlevel%
)

echo 🎉 Deployment completed successfully!
pause
endlocal
