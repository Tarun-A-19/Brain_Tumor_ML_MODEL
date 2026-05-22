@echo off
echo 🧠 Starting BrainScan AI...
echo.

echo → Starting backend on port 8000...
start "BrainScan Backend" cmd /c "cd backend && uvicorn main:app --reload --port 8000"

echo → Starting frontend on port 5173...
start "BrainScan Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo ✅ BrainScan AI is running!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8000
echo.
pause
