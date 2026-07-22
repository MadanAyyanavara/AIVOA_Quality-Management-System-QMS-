# Pharmaceutical Quality Management System (QMS) - Complaint Intake API

A modern, AI-powered FastAPI backend for managing pharmaceutical product complaints with intelligent data extraction using LangGraph and Groq.

## Features

✨ **AI-Powered Extraction** - Automatically extract complaint data from raw text using Groq LLMs  
📦 **Complete CRUD Operations** - Manage complaints with full create, read, update capabilities  
💬 **Interactive Chat** - Ask questions about complaints and get expert pharmaceutical analysis  
🔒 **Type-Safe** - Full type hints with Pydantic validation  
📚 **Auto-Documented** - Interactive Swagger UI and ReDoc documentation  
⚡ **Production-Ready** - Connection pooling, error handling, logging  
🐳 **Docker Support** - Ready-to-deploy Docker and Docker Compose configuration  

## Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL 12+ (or Docker)
- Groq API key (free: https://console.groq.com)

### 1. Installation
```bash
git clone <repo-url>
cd AIVOA_Quality-Management-System-QMS-
pip install -r requirements.txt
```

### 2. Setup Database
```bash
# Option A: Docker (easiest)
docker run --name qms-postgres \
  -e POSTGRES_DB=qms_db \
  -e POSTGRES_USER=qms_user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 3. Configure
```bash
cp .env.example .env
# Edit .env with your database URL and Groq API key
```

### 4. Run
```bash
python run.py
```

Access the API at http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/extract` | Extract complaint data from raw text |
| POST | `/api/complaints` | Create new complaint |
| GET | `/api/complaints` | List complaints (with filtering) |
| GET | `/api/complaints/{id}` | Get specific complaint |
| PUT | `/api/complaints/{id}` | Update complaint |
| POST | `/api/chat` | Chat about complaint details |

## Example Usage

### Extract Complaint Data
```bash
curl -X POST "http://localhost:8000/api/extract" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Customer reported on 2024-01-15 that Aspirin batch AB123 caused headache..."
  }'
```

### Create Complaint
```bash
curl -X POST "http://localhost:8000/api/complaints" \
  -H "Content-Type: application/json" \
  -d '{
    "origin_source": "Customer",
    "customer_name": "John Doe",
    "product_name": "Aspirin",
    "batch_number": "AB-2024-001",
    "complaint_type": "Adverse Effect",
    "complaint_date": "2024-01-15",
    "description": "Severe headache after taking medication",
    "initial_severity": "High",
    "status": "Pending Triage"
  }'
```

### List Complaints
```bash
curl "http://localhost:8000/api/complaints?product_name=Aspirin&status=Pending%20Triage"
```

### Chat About Complaint
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_text": "Patient reported headache from Aspirin batch AB-2024-001",
    "question": "What severity level should this be?"
  }'
```

## Project Structure

```
├── app/
│   ├── main.py                 # FastAPI application
│   ├── config.py              # Configuration management
│   ├── database.py            # SQLAlchemy setup
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic schemas
│   ├── langgraph_workflow.py   # LangGraph extraction workflow
│   └── api/
│       ├── extraction.py       # Extraction endpoints
│       ├── complaints.py       # Complaint CRUD endpoints
│       └── chat.py            # Chat endpoint
├── run.py                      # Entry point
├── requirements.txt            # Dependencies
├── Dockerfile                  # Docker image
├── docker-compose.yml          # Docker Compose setup
├── .env.example               # Environment template
├── SETUP.md                   # Detailed setup guide
├── API_DOCUMENTATION.md       # Complete API reference
├── QUICKSTART.md              # Quick start guide
└── example_usage.py           # Usage examples
```

## Database Schema

### Complaint Table

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| origin_source | String | Source (Customer, Doctor, Hospital, etc.) |
| customer_name | String | Reporter name |
| product_name | String | Product name |
| product_strength | String | Strength (e.g., 500mg) |
| batch_number | String | Batch/Lot number |
| mfg_date | Date | Manufacturing date |
| expiry_date | Date | Expiry date |
| quantity_affected | String | Quantity affected |
| complaint_type | String | Type (Adverse Effect, Defective, etc.) |
| complaint_date | Date | Complaint date |
| description | String | Detailed description |
| initial_severity | Enum | Low/Medium/High/Critical |
| priority | String | Priority level |
| status | Enum | Pending Triage/In Investigation/Resolved/Closed |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Update timestamp |

## Technology Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database
- **LangGraph** - Agentic workflow framework
- **LangChain** - LLM integration library
- **Groq** - Fast LLM inference (Gemma 2, Llama)
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Configuration

All configuration is managed via environment variables in `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/qms_db

# Groq API
GROQ_API_KEY=your_key_here

# API Settings
API_TITLE=Pharmaceutical QMS
API_VERSION=1.0.0
DEBUG=False
CORS_ORIGINS=["http://localhost:3000"]
```

## Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
1. Set environment variables on your server
2. Install dependencies: `pip install -r requirements.txt`
3. Run database migrations (if applicable)
4. Start with: `python run.py`

## Documentation

- **SETUP.md** - Detailed installation and configuration
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **QUICKSTART.md** - Get started in 5 minutes
- **example_usage.py** - Python examples of all endpoints

## Key Features in Detail

### LangGraph Workflow
- Structured extraction of complaint data from unstructured text
- Automatic severity level classification
- JSON response validation with Pydantic
- Fallback error handling

### Complaint Management
- Full CRUD operations
- Advanced filtering (product, batch, status)
- Pagination support
- Audit timestamps

### Pharmaceutical AI Chat
- Expert analysis of complaints
- Severity and priority assessment
- Recommendation generation
- Powered by Groq LLMs

## Error Handling

The API includes comprehensive error handling:
- Input validation with Pydantic
- SQL injection prevention (SQLAlchemy ORM)
- Proper HTTP status codes
- Detailed error messages (in development)

## Security

- Type-safe code with Pydantic validation
- SQL injection prevention with ORM
- CORS configuration for frontend integration
- Environment-based secrets (API keys)
- Recommended: Add authentication layer for production

## Performance

- Database connection pooling (10 connections)
- Indexed columns for fast queries
- Async/await for I/O operations
- Efficient JSON response serialization

## Logging

Structured logging configured for development and production:
```python
import logging
logger = logging.getLogger(__name__)
```

Logs include:
- Request/response details
- Database operations
- LLM API calls
- Error stack traces

## Testing

Run the included example script:
```bash
python example_usage.py
```

This demonstrates all endpoints and workflows.

## Contributing

1. Follow the existing code structure
2. Add type hints to all functions
3. Include docstrings for public functions
4. Use environment variables for configuration
5. Test changes against the example script

## Support

For issues or questions:
- Check **SETUP.md** for installation help
- Review **API_DOCUMENTATION.md** for endpoint details
- Examine **example_usage.py** for usage patterns

## License

See LICENSE file for details.

## Version

API Version: 1.0.0  
Python Version: 3.9+  
FastAPI Version: 0.104.1

---

**Built with ❤️ for pharmaceutical quality management**