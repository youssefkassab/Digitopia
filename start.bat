@echo off
REM This script automates the process of installing dependencies and
REM starting both the backend and frontend services of a full-stack application.
REM It ensures that each step is successful before proceeding.

echo Starting full-stack application...

REM Navigate to the backend directory
echo Navigating to backend directory...
cd backend
if %errorlevel% neq 0 (
echo Error: 'backend' directory not found. Aborting.
pause
exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
echo Error: 'npm install' failed in backend. Aborting.
pause
exit /b 1
)

REM Start the backend
start "Backend Server" cmd /c "npm start"

REM Navigate back to the parent directory
cd ..
if %errorlevel% neq 0 (
echo Error: Could not navigate back. Aborting.
pause
exit /b 1
)

REM Navigate to the frontend directory
echo Navigating to frontend directory...
cd frontend
if %errorlevel% neq 0 (
echo Error: 'frontend' directory not found. Aborting.
pause
exit /b 1
)

REM Install frontend dependencies with a flag to bypass dependency conflicts
echo Installing frontend dependencies...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
echo Error: 'npm install' failed in frontend. Aborting.
pause
exit /b 1
)

REM Start the frontend
start "Frontend Dev Server" cmd /c "npm run dev"

echo Backend and frontend processes are running.
echo You can close the separate terminal windows to stop them.
echo Press any key to exit this script...
pause

exit /b 0