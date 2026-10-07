@echo off
title Push to GitHub - rophya12-lgtm/hall-booking
cls
echo ================================================================
echo    Pushing College Resource Booking to GitHub
echo    Target: https://github.com/rophya12-lgtm/hall-booking.git
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/4] Checking Git installation...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed or not in your system PATH!
    echo Please install Git from https://git-scm.com/ and try again.
    echo.
    pause
    exit /b 1
)

echo [2/4] Initializing and staging files...
git init
git add .

echo [3/4] Committing code...
git commit -m "College Resource Booking with Firebase Auth, Firestore Database, and Email Notifications"

echo [4/4] Configuring remote and pushing to main...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/rophya12-lgtm/hall-booking.git

echo.
echo Pushing to GitHub...
echo (If prompted, sign in to your GitHub account)
echo.
git push -u origin main --force

echo.
echo ================================================================
echo If the push succeeded, view your repository here:
echo https://github.com/rophya12-lgtm/hall-booking
echo ================================================================
pause
