#!/bin/bash
echo "🧠 Starting BrainScan AI..."
echo ""

# Start backend
echo "→ Starting backend on port 8000..."
cd backend && uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "→ Starting frontend on port 5173..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ BrainScan AI is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop."

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
