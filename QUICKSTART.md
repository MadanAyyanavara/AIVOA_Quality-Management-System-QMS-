# Quick Start Guide

Get the Pharmaceutical QMS API running in 5 minutes.

## Prerequisites
- Python 3.9+
- PostgreSQL (or Docker)
- Groq API key (free: https://console.groq.com)

## 1. Clone & Install (1 min)

```bash
cd AIVOA_Quality-Management-System-QMS-
pip install -r requirements.txt
```

## 2. Setup Database (2 min)

**Option A: Docker (easiest)**
```bash
docker run --name qms-postgres \
  -e POSTGRES_DB=qms_db \
  -e POSTGRES_USER=qms_user \
  -e POSTGRES_PASSWORD=password123 \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**Option B: Local PostgreSQL**
```sql
CREATE DATABASE qms_db;
CREATE USER qms_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE qms_db TO qms_user;
```

## 3. Configure Environment (1 min)

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://qms_user:password123@localhost:5432/qms_db
GROQ_API_KEY=your_groq_key_here
DEBUG=False
```

## 4. Run (1 min)

```bash
python run.py
```

You'll see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 5. Test

Open http://localhost:8000/docs in your browser to see interactive API docs.

Or test from command line:

```bash
# Extract complaint data
curl -X POST "http://localhost:8000/api/extract" \
  -H "Content-Type: application/json" \
  -d '{"text": "Customer John Doe reported on Jan 15 that Aspirin batch AB123 caused headache. Bought 2 bottles with expiry 2025-06-10."}'

# Create complaint
curl -X POST "http://localhost:8000/api/complaints" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_source": "Customer",
    "customer_name": "John Doe",
    "product_name": "Aspirin",
    "batch_number": "AB-2024-001",
    "complaint_type": "Adverse Effect",
    "complaint_date": "2024-01-15",
    "description": "Caused headache",
    "initial_severity": "High",
    "status": "Pending Triage"
  }'

# List complaints
curl "http://localhost:8000/api/complaints"

# Chat about complaint
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_text": "Aspirin batch AB-2024-001 caused headache on 2024-01-15",
    "question": "What severity level should this be?"
  }'
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/extract` | Extract complaint from raw text |
| POST | `/api/complaints` | Create complaint |
| GET | `/api/complaints` | List complaints |
| GET | `/api/complaints/{id}` | Get specific complaint |
| PUT | `/api/complaints/{id}` | Update complaint |
| POST | `/api/chat` | Chat about complaint |
| GET | `/health` | Health check |

## Full Documentation

- **Setup:** See `SETUP.md`
- **API Reference:** See `API_DOCUMENTATION.md`
- **Architecture:** See code comments in `app/` directory

## Next Steps

1. Connect your frontend to `http://localhost:8000`
2. Implement authentication in production
3. Deploy to your cloud platform
4. Set up monitoring and logging

## Troubleshooting

**Database Connection Error?**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env

**Groq API Error?**
- Verify GROQ_API_KEY is correct
- Check Groq console for key status

**Port 8000 in Use?**
- Change port: `python run.py` → modify `run.py` or use `--port 8001`

**Still need help?**
- Check SETUP.md for detailed instructions
- Read API_DOCUMENTATION.md for endpoint details
