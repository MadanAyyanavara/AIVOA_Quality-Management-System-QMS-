# VSCode Setup - Run Application in IDE

Follow these steps to run the entire project from within VSCode.

---

## Step 1: Open Two Terminals in VSCode

### Terminal 1 - Backend Server
1. In VSCode, press `Ctrl + Shift + ~` (or use **Terminal → New Terminal**)
2. You should see a terminal at the bottom
3. Make sure you're in the project root directory (you should see the `app/` folder)
4. Run this command:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started server process
Waiting for application startup.
Starting Pharmaceutical QMS API
```

### Terminal 2 - Frontend Server
1. Press `Ctrl + Shift + ~` again to open another terminal
2. Or click the **+** button next to the terminal tab
3. Navigate to the frontend directory:

```bash
cd frontend
```

4. Run this command:

```bash
npm run dev
```

**Expected Output:**
```
> vite

  VITE v5.x.x  ready in XX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## Step 2: Open Your Browser

Once both terminals show they're running:

### Main Application
```
http://localhost:3000
```
or
```
http://localhost:5173
```

### API Documentation
```
http://localhost:8000/docs
```

### API Health Check
```
http://localhost:8000/health
```

---

## Step 3: Test the Application

1. **Go to:** http://localhost:3000
2. **Upload/Paste:** Text about a complaint in the AI panel
3. **Watch:** Form auto-populates with extracted data
4. **Chat:** Ask questions about the complaint
5. **Analyze:** Click "Analyze Risk" for scoring

---

## 📸 What Your VSCode Should Look Like

```
┌─────────────────────────────────────────────────┐
│  VSCode Window                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  File Explorer (left):                          │
│  ├── app/                                       │
│  ├── frontend/                                  │
│  ├── requirements.txt                           │
│  └── .env                                       │
│                                                 │
│  Main Editor (center) - shows file contents     │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │ Terminal (bottom)                        │   │
│  ├──────────────────────────────────────────┤   │
│  │ Terminal 1: Backend                      │   │
│  │ $ uvicorn app.main:app --reload...      │   │
│  │ INFO: Uvicorn running on 0.0.0.0:8000   │   │
│  │                                          │   │
│  │ Terminal 2: Frontend                     │   │
│  │ $ npm run dev                            │   │
│  │ ➜  Local: http://localhost:5173/        │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Keyboard Shortcuts in VSCode

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + ~` | Open/Close Terminal |
| `Ctrl + K, Ctrl + O` | Open Folder |
| `Ctrl + K, Ctrl + N` | New Terminal |
| `Ctrl + Shift + J` | Toggle Side Panel |
| `Ctrl + J` | Toggle Bottom Panel |

---

## ✅ Terminal 1 Output (Backend)

You should see:
```
INFO:     Will watch for changes in these directories: ['/path/to/project']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXXX] using WatchFiles
INFO:     Started server process [XXXXX]
INFO:     Waiting for application startup.
2026-07-23 HH:MM:SS - app.main - INFO - Starting Pharmaceutical QMS API
INFO:     Application startup complete
```

---

## ✅ Terminal 2 Output (Frontend)

You should see:
```
> vite

  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## 🌐 Then Access in Browser

After both show "ready":

1. **Open Browser**
2. **Go to:** http://localhost:3000 (or 5173)
3. **You should see:** The complaint intake form with AI assistant panel
4. **Start testing:** Upload files, paste text, chat with AI

---

## 🐛 Troubleshooting

### "Port 8000 already in use"
```bash
# Kill the process and try again
# Or change port: uvicorn app.main:app --port 8001
```

### "npm not found"
```bash
# Make sure you're in the frontend directory
cd frontend
npm run dev
```

### "Module not found" error in Python
```bash
# Make sure all dependencies are installed
pip install -r requirements.txt
```

### Frontend shows blank page
```bash
# Wait 15-20 seconds for Vite to fully build
# Check the terminal for errors
# Try refreshing the browser (F5)
```

---

## 📝 What Each Terminal Does

### Terminal 1: Backend
- Runs FastAPI server on port 8000
- Processes extraction requests
- Handles AI chat via Groq API
- Performs risk analysis
- Auto-reloads when files change (`--reload` flag)

### Terminal 2: Frontend
- Runs Vite dev server on port 5173
- Provides React application
- Hot reloads when files change
- Can be accessed via http://localhost:3000 or http://localhost:5173

---

## 🎯 Full URLs Reference

| Purpose | URL |
|---------|-----|
| Main App | http://localhost:3000 |
| App (alt) | http://localhost:5173 |
| API Base | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health | http://localhost:8000/health |

---

## 🚀 You're Ready!

Once you see both "running" messages:

1. Open http://localhost:3000 in your browser
2. Start testing the complaint intake system
3. Use the API docs at /docs to explore endpoints
4. Both terminals will show live logs as you interact

**Happy coding!** 🎉
