# Pharmaceutical QMS - Complaint Intake API Setup Guide

## Prerequisites
- Python 3.9 or higher
- PostgreSQL 12 or higher
- Groq API key (free at https://console.groq.com)

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Setup Database

### Option A: Local PostgreSQL

1. Create a database:
```sql
CREATE DATABASE qms_db;
```

2. Create a database user (optional but recommended):
```sql
CREATE USER qms_user WITH PASSWORD 'your_secure_password';
ALTER ROLE qms_user SET client_encoding TO 'utf8';
ALTER ROLE qms_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE qms_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE qms_db TO qms_user;
```

### Option B: Docker (Quick Start)

```bash
docker run --name qms-postgres \
  -e POSTGRES_DB=qms_db \
  -e POSTGRES_USER=qms_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

## Step 3: Configure Environment

Copy and configure the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database Configuration
DATABASE_URL=postgresql://qms_user:your_secure_password@localhost:5432/qms_db

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# FastAPI Configuration
API_TITLE=Pharmaceutical QMS
API_VERSION=1.0.0
DEBUG=False
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
```

### Getting Your Groq API Key

1. Visit https://console.groq.com
2. Sign up for a free account
3. Create an API key
4. Copy the key to your `.env` file

## Step 4: Initialize Database

The database tables will be automatically created when you run the application for the first time. The `init_db()` function in `app/main.py` handles this during startup.

## Step 5: Run the Application

```bash
python run.py
```

The API will be available at:
- **API Docs (Swagger UI):** http://localhost:8000/docs
- **Alternative Docs (ReDoc):** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

## Testing the API

### 1. Extract Complaint Data

```bash
curl -X POST "http://localhost:8000/api/extract" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Customer reported on 2024-01-15 that Aspirin batch AB-2024-001 with strength 500mg purchased on 2023-06-10 and expiring 2025-06-10 caused headache. They purchased 2 bottles. The complaint type is Adverse Effect."
  }'
```

### 2. Create a Complaint

```bash
curl -X POST "http://localhost:8000/api/complaints" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_source": "Customer",
    "customer_name": "John Doe",
    "product_name": "Aspirin",
    "product_strength": "500mg",
    "batch_number": "AB-2024-001",
    "mfg_date": "2023-06-10",
    "expiry_date": "2025-06-10",
    "quantity_affected": "2 bottles",
    "complaint_type": "Adverse Effect",
    "complaint_date": "2024-01-15",
    "description": "Patient experienced severe headache after taking the medication",
    "initial_severity": "High",
    "priority": "High",
    "status": "Pending Triage"
  }'
```

### 3. List Complaints

```bash
curl "http://localhost:8000/api/complaints?skip=0&limit=10"
```

### 4. Get Specific Complaint

```bash
curl "http://localhost:8000/api/complaints/1"
```

### 5. Update Complaint

```bash
curl -X PUT "http://localhost:8000/api/complaints/1" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_source": "Customer",
    "customer_name": "John Doe",
    "product_name": "Aspirin",
    "product_strength": "500mg",
    "batch_number": "AB-2024-001",
    "mfg_date": "2023-06-10",
    "expiry_date": "2025-06-10",
    "quantity_affected": "2 bottles",
    "complaint_type": "Adverse Effect",
    "complaint_date": "2024-01-15",
    "description": "Patient experienced severe headache after taking the medication",
    "initial_severity": "High",
    "priority": "High",
    "status": "In Investigation"
  }'
```

### 6. Chat About Complaint

```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_text": "Patient reported headache after taking Aspirin batch AB-2024-001 on 2024-01-15",
    "question": "What is the initial severity level for this complaint and why?"
  }'
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database user has correct permissions

### Groq API Error
- Verify GROQ_API_KEY is set correctly
- Check Groq console for API key expiration
- Ensure network connectivity to Groq API

### Port Already in Use
- Change the port in `run.py` or use environment variable:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8001
  ```

### CORS Issues
- Update CORS_ORIGINS in .env to match your frontend URL
- In development, you can use `["*"]` but always specify in production

## Project Structure

```
.
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── langgraph_workflow.py # LangGraph extraction workflow
│   └── api/
│       ├── __init__.py
│       ├── extraction.py     # Extraction endpoint
│       ├── complaints.py     # Complaint CRUD endpoints
│       └── chat.py          # Chat endpoint
├── run.py                   # Entry point script
├── requirements.txt         # Python dependencies
├── .env.example            # Environment template
└── SETUP.md                # This file
```

## Architecture Overview

### Components

1. **FastAPI App (`app/main.py`)**
   - CORS-enabled REST API
   - Automatic API documentation
   - Health check endpoint

2. **Database Layer**
   - SQLAlchemy ORM with PostgreSQL
   - Automatic schema initialization
   - Connection pooling

3. **Data Validation**
   - Pydantic models for request/response validation
   - Type hints throughout

4. **LangGraph Workflow**
   - Structured extraction using Groq
   - JSON parsing with fallback error handling
   - Severity level inference

5. **API Endpoints**
   - Extraction: POST /api/extract
   - Complaints: POST, GET, PUT /api/complaints
   - Chat: POST /api/chat

## Next Steps

1. Connect the frontend to the API
2. Implement additional complaint workflow statuses
3. Add audit logging for compliance
4. Deploy to production environment
5. Set up monitoring and alerting

## Support

For issues or questions, refer to:
- FastAPI docs: https://fastapi.tiangolo.com
- LangChain docs: https://python.langchain.com
- SQLAlchemy docs: https://docs.sqlalchemy.org
