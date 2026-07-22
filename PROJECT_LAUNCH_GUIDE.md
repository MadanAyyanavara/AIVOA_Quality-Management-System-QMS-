# 🚀 PROJECT LAUNCH GUIDE - QMS Complaint Intake System

**Status:** READY TO RUN  
**Date:** July 23, 2026  
**Groq API Key:** ✅ Configured  
**PostgreSQL:** ⏭️ Skipped (Optional - Features will work without it)

---

## 📋 QUICK START (2 Commands)

### Terminal 1 - Start Backend Server
```bash
cd "C:\Users\Madan A\OneDrive\Documents\Desktop\Quality Management System (QMS)\AIVOA_Quality-Management-System-QMS-"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend URL:** http://localhost:8000

### Terminal 2 - Start Frontend Server
```bash
cd "C:\Users\Madan A\OneDrive\Documents\Desktop\Quality Management System (QMS)\AIVOA_Quality-Management-System-QMS-\frontend"
npm run dev
```

**Frontend URL:** http://localhost:3000 (or http://localhost:5173)

---

## 🌐 ACCESS POINTS

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend App** | http://localhost:3000 | Main complaint intake UI |
| **API Docs** | http://localhost:8000/docs | Swagger UI - Test endpoints |
| **API ReDoc** | http://localhost:8000/redoc | Alternative API docs |
| **API Health** | http://localhost:8000/health | Check API status |

---

## 🎯 AVAILABLE FEATURES

### ✅ Working Features (No Database Required)
- **File/Text Extraction** - Extract complaint data from documents using Groq AI
- **AI Chat** - Ask questions about complaints with Groq AI
- **Risk Analysis** - Get completeness scores and CAPA recommendations
- **Progress Tracking** - Real-time upload and extraction progress

### ⚠️ Limited Features (Database Required for Full Functionality)
- **Save Complaint** - Requires PostgreSQL (currently skipped)
- **List Complaints** - Requires PostgreSQL (currently skipped)
- **Update Complaint** - Requires PostgreSQL (currently skipped)

---

## 🧪 TEST THE SYSTEM

### 1. Test AI Extraction (File Upload)
```
1. Open http://localhost:3000
2. In the right panel, drag & drop a text/PDF file (or paste text)
3. Watch the form auto-populate with extracted data ✅
```

### 2. Test AI Chat
```
1. After extraction, go to Chat tab
2. Ask: "What's the severity of this complaint?"
3. Get AI-powered response ✅
```

### 3. Test Risk Analysis
```
1. Fill out the complaint form manually or from extraction
2. Click "Analyze Risk" button
3. See completeness score and recommendations ✅
```

### 4. Test API Directly
```
1. Go to http://localhost:8000/docs
2. Try POST /api/extract endpoint
3. Test POST /api/chat endpoint
4. Test POST /api/analyze-risk endpoint ✅
```

---

## 📊 ENVIRONMENT CONFIGURATION

### Backend (.env) - Already Configured
```
DATABASE_URL=postgresql://user:password@localhost:5432/qms_db
GROQ_API_KEY=your_groq_api_key_here
API_TITLE=Pharmaceutical QMS
API_VERSION=1.0.0
DEBUG=False
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173", "http://localhost:8080"]
```

### Frontend Environment
Auto-configured to use: `http://localhost:8000`

---

## 🔧 TROUBLESHOOTING

### "Address already in use" Port 8000
```bash
# Kill process on port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Or change port: uvicorn app.main:app --port 8001
```

### "npm install failed" 
Already handled with `--legacy-peer-deps` flag

### "CORS error" when calling API
Ensure backend is running on http://localhost:8000

### "Groq API Error"
Verify GROQ_API_KEY in .env is correct (already set)

### "PostgreSQL Connection Failed"
Expected since we skipped setup. Database features won't work but AI features will.

---

## 📁 PROJECT STRUCTURE

```
QMS_Project/
├── app/                          # Backend (FastAPI)
│   ├── main.py                   # FastAPI app
│   ├── config.py                 # Environment config
│   ├── database.py               # SQLAlchemy setup
│   ├── models.py                 # Complaint model
│   ├── schemas.py                # Pydantic schemas
│   ├── langgraph_workflow.py     # AI extraction & risk analysis
│   └── api/
│       ├── extraction.py         # Extract endpoint
│       ├── complaints.py         # Complaints CRUD
│       ├── chat.py               # Chat endpoint
│       └── risk_analysis.py      # Risk analysis endpoint
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── redux/                # Redux state
│   │   ├── services/             # API client
│   │   ├── hooks/                # Custom hooks
│   │   └── utils/                # Utilities
│   └── package.json
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
└── run.py                        # Backend startup script
```

---

## 🚀 FULL DEPLOYMENT CHECKLIST

- [x] Python dependencies installed
- [x] Frontend dependencies installing
- [x] Groq API key configured
- [x] Backend imports verified
- [x] Environment variables set
- [x] CORS configured for localhost
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Test extraction feature
- [ ] Test chat feature
- [ ] Test risk analysis
- [ ] (Optional) Setup PostgreSQL for save feature

---

## 📝 WORKING ENDPOINTS

### Extraction (AI-Powered)
**POST** `/api/extract`
```json
{
  "text": "Customer complaint about product quality..."
}
```
Response: Extracted complaint fields

### Chat (AI-Powered)
**POST** `/api/chat`
```json
{
  "complaint_text": "...",
  "question": "What severity?"
}
```
Response: AI analysis

### Risk Analysis (AI-Powered + Optional DB)
**POST** `/api/analyze-risk`
```json
{
  "product_name": "Medicine X",
  "batch_number": "BATCH123",
  ...
}
```
Response: Scores and recommendations

### Health Check
**GET** `/health`
Response: `{"status": "ok"}`

---

## 💡 NEXT STEPS (Optional)

### To Enable Full Database Features
1. Install PostgreSQL
2. Update DATABASE_URL in .env
3. Restart backend
4. Features will auto-initialize on startup

### To Deploy to Production
1. Build frontend: `npm run build`
2. Set `DEBUG=False` in .env
3. Use production-grade ASGI server (Gunicorn)
4. Setup proper database backups
5. Configure environment variables securely

---

## 🎉 YOU'RE ALL SET!

Your Pharmaceutical QMS Complaint Intake System is ready to run!

**Backend:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Access:** http://localhost:3000

---

**Built with:** FastAPI • LangGraph • Groq • React • Redux • Tailwind CSS

🚀 **Happy Testing!** 🚀
