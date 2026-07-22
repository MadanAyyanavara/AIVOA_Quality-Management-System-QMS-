# System Architecture

Comprehensive architecture documentation for the Pharmaceutical QMS Complaint Intake API.

## System Overview

The Pharmaceutical Quality Management System (QMS) is a modern, cloud-native application built with FastAPI that manages pharmaceutical product complaints with AI-powered data extraction.

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend                                │
│                    (React, Vue, Angular)                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Nginx Reverse Proxy                         │
│                 (SSL/TLS, Rate Limiting, Load Balance)           │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                       FastAPI Application                        │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │              API Routes (5 core endpoints)              │  │
│    │  • POST /api/extract - Complaint extraction            │  │
│    │  • POST /api/complaints - Create complaint             │  │
│    │  • GET /api/complaints - List complaints               │  │
│    │  • PUT /api/complaints/{id} - Update complaint         │  │
│    │  • POST /api/chat - Interactive chat                   │  │
│    └─────────────────────────────────────────────────────────┘  │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │           LangGraph Workflow Engine                     │  │
│    │    ┌──────────────────────────────────────────────┐     │  │
│    │    │  Extraction Node (Groq API)                  │     │  │
│    │    │  • Calls Gemma2-9b-it or Llama-3.3-70b      │     │  │
│    │    │  • Extracts structured complaint data        │     │  │
│    │    │  • Validates with Pydantic                  │     │  │
│    │    │  • Infers severity levels                   │     │  │
│    │    └──────────────────────────────────────────────┘     │  │
│    └─────────────────────────────────────────────────────────┘  │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │        SQLAlchemy ORM Data Access Layer                │  │
│    │  • Complaint model mapping                             │  │
│    │  • Query builders with filtering                       │  │
│    │  • Transaction management                             │  │
│    └─────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ TCP
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Complaints Table                              │ │
│  │  • 15 core complaint fields                               │ │
│  │  • Indexed for fast queries                               │ │
│  │  • Timestamps for audit trail                             │ │
│  │  • Enum types for status/severity                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Connection Pool (10 connections, max 20)                 │ │
│  │  Pre-ping for stale connection detection                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

           ↓ (API calls)
┌──────────────────────────────────────────────────────────────────┐
│                    Groq API (External)                           │
│  • Gemma2-9b-it model (9 billion parameters)                     │
│  • Llama-3.3-70b-versatile (70 billion parameters)               │
│  • Real-time inference                                           │
│  • Minimal latency                                               │
└──────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. FastAPI Application Layer (`app/main.py`)

**Responsibilities:**
- HTTP request/response handling
- CORS configuration
- Route registration
- Startup/shutdown lifecycle
- Auto-documentation (Swagger UI, ReDoc)

**Key Features:**
- Async request handling with Uvicorn
- Automatic OpenAPI schema generation
- Built-in request validation
- Exception handling middleware

### 2. API Route Modules (`app/api/`)

#### Extraction Router (`extraction.py`)
```
POST /api/extract
│
├─ Input: { text: str }
│
├─ Process:
│  └─ Call langgraph_workflow.extract_complaint_from_text()
│
└─ Output: { success: bool, extracted_data: ComplaintExtract, error: str }
```

#### Complaints Router (`complaints.py`)
```
POST /api/complaints     → Create complaint in DB
GET /api/complaints      → List with filtering & pagination
GET /api/complaints/{id} → Get single complaint
PUT /api/complaints/{id} → Update complaint
```

#### Chat Router (`chat.py`)
```
POST /api/chat
│
├─ Input: { complaint_text: str, question: str }
│
├─ Process:
│  ├─ Initialize Groq LLM
│  ├─ Create system prompt
│  ├─ Send to LLM with complaint context
│  └─ Parse response
│
└─ Output: { answer: str, success: bool }
```

### 3. LangGraph Workflow (`app/langgraph_workflow.py`)

**Architecture:**

```
State: ExtractionState
  ├─ raw_text: str
  ├─ extracted_data: ExtractedComplaint (optional)
  ├─ error: str (optional)
  └─ extraction_attempts: int

Workflow: StateGraph
  │
  ├─ START
  │   │
  │   ├─ extraction_node()
  │   │  ├─ Initialize Groq ChatLLM
  │   │  ├─ Create extraction prompt
  │   │  ├─ Call LLM.invoke()
  │   │  ├─ Parse JSON response
  │   │  ├─ Validate with Pydantic
  │   │  └─ Update state
  │   │
  │   └─ END
```

**Key Components:**

1. **Extraction Prompt**
   - System: Pharmaceutical quality analyst role
   - Structured JSON format specification
   - Date standardization (YYYY-MM-DD)
   - Severity level inference rules

2. **LLM Configuration**
   - Model: Gemma2-9b-it (configurable)
   - Temperature: 0.1 (low for consistency)
   - Groq API for fast inference

3. **Data Validation**
   - Pydantic model: `ExtractedComplaint`
   - Type checking for all fields
   - Date parsing and formatting

### 4. Database Layer

#### SQLAlchemy Models (`app/models.py`)

```python
Complaint
├─ id: PK
├─ Origin: origin_source, customer_name
├─ Product: product_name, product_strength, batch_number
├─ Dates: mfg_date, expiry_date, complaint_date
├─ Issue: complaint_type, description, quantity_affected
├─ Classification: initial_severity, priority, status
└─ Audit: created_at, updated_at
```

**Enums:**
- `SeverityLevel`: Low, Medium, High, Critical
- `ComplaintStatus`: Pending Triage, In Investigation, Resolved, Closed

#### Database Configuration (`app/database.py`)

```python
Engine
├─ Connection Pool
│  ├─ Pool size: 10
│  ├─ Max overflow: 20
│  ├─ Pre-ping: True (detect stale connections)
│  └─ Echo: Debug mode configurable
│
├─ Session Factory
│  ├─ Autocommit: False
│  ├─ Autoflush: False
│  └─ Bind to engine
│
└─ Initialization
   └─ Base.metadata.create_all() on startup
```

### 5. Data Validation Layer

#### Pydantic Schemas (`app/schemas.py`)

**Request Schemas:**
- `ExtractRequest` - For /api/extract
- `ComplaintCreate` - For POST/PUT complaints
- `ChatRequest` - For /api/chat

**Response Schemas:**
- `ExtractionResponse` - With extracted_data
- `ComplaintResponse` - Full complaint with timestamps
- `ChatResponse` - AI-generated response

**Validation Features:**
- Field type checking
- Min/max constraints
- Enum validation
- Custom validators

### 6. Configuration Layer (`app/config.py`)

```python
Settings (BaseSettings)
├─ database_url
├─ groq_api_key
├─ api_title
├─ api_version
├─ debug
└─ cors_origins
```

Loaded from `.env` file with environment variable fallbacks.

## Data Flow Diagrams

### Extraction Flow

```
1. User Input
   └─ POST /api/extract { text: "complaint text" }

2. Request Validation
   └─ Pydantic validates ExtractRequest

3. LangGraph Workflow
   ├─ Create initial state
   ├─ Enter extraction_node
   │  ├─ Initialize ChatGroq("gemma2-9b-it")
   │  ├─ Build prompt with system instructions
   │  ├─ Invoke LLM
   │  ├─ Parse JSON response
   │  ├─ Validate with ExtractedComplaint model
   │  └─ Update state with extracted_data
   └─ Exit workflow

4. Response
   └─ ExtractionResponse {
        success: true,
        extracted_data: { ... },
        error: null
      }
```

### Complaint Creation Flow

```
1. User Input
   └─ POST /api/complaints { complaint data }

2. Request Validation
   └─ Pydantic validates ComplaintCreate

3. Database Operation
   ├─ Create Complaint ORM instance
   ├─ db.add(complaint)
   ├─ db.commit()
   └─ db.refresh(complaint)

4. Response
   └─ ComplaintResponse {
        id: 42,
        ... all fields ...,
        created_at: datetime,
        updated_at: datetime
      }
```

### Chat Flow

```
1. User Input
   └─ POST /api/chat { complaint_text, question }

2. Request Validation
   └─ Pydantic validates ChatRequest

3. LLM Processing
   ├─ Initialize ChatGroq("gemma2-9b-it")
   ├─ Create system prompt (pharma analyst role)
   ├─ Create human message (complaint + question)
   ├─ Invoke LLM
   └─ Extract response content

4. Response
   └─ ChatResponse {
        answer: "AI analysis...",
        success: true
      }
```

## Database Schema

### Complaints Table

```sql
CREATE TABLE complaints (
  -- Primary Key
  id SERIAL PRIMARY KEY,
  
  -- Origin & Customer (Required for traceability)
  origin_source VARCHAR(100) NOT NULL,
  customer_name VARCHAR(255),
  
  -- Product Information (Required for batch tracking)
  product_name VARCHAR(255) NOT NULL,
  product_strength VARCHAR(100),
  batch_number VARCHAR(100) NOT NULL,
  mfg_date DATE,
  expiry_date DATE,
  quantity_affected VARCHAR(100),
  
  -- Complaint Details (Core issue data)
  complaint_type VARCHAR(100) NOT NULL,
  complaint_date DATE NOT NULL,
  description TEXT NOT NULL,
  
  -- Classification (For workflow & prioritization)
  initial_severity VARCHAR(20) NOT NULL DEFAULT 'Medium',
  priority VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending Triage',
  
  -- Audit Trail (For compliance)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes (For query performance)
  INDEX idx_product_name (product_name),
  INDEX idx_batch_number (batch_number),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_severity (initial_severity)
);
```

## Error Handling Strategy

```
Request → Input Validation (Pydantic)
          ├─ ValidationError → 400 Bad Request
          │
          ├─ Success ↓
          │
          ├─ Business Logic
          │  ├─ Database Error → 500 Internal Error (with rollback)
          │  ├─ LLM Error → 500 Internal Error
          │  ├─ Not Found → 404 Not Found
          │  └─ Success ↓
          │
          └─ Response Serialization
             └─ Success → 200/201 with JSON
```

## Security Architecture

```
┌─ Input Layer ────────────────────────────────────┐
│ Pydantic Validation                              │
│ ├─ Type checking                                 │
│ ├─ Length limits (50KB text, 5KB questions)     │
│ └─ Enum validation                               │
└──────────────────────────────────────────────────┘

┌─ Database Layer ─────────────────────────────────┐
│ SQLAlchemy ORM                                   │
│ ├─ Parameterized queries (SQL injection proof)  │
│ ├─ Connection pooling                            │
│ └─ Transaction isolation                         │
└──────────────────────────────────────────────────┘

┌─ API Layer ──────────────────────────────────────┐
│ CORS Configuration                               │
│ ├─ Allowed origins whitelist                     │
│ ├─ Credentials handling                          │
│ └─ Method restrictions                           │
└──────────────────────────────────────────────────┘

┌─ External API Layer ─────────────────────────────┐
│ Groq API                                         │
│ ├─ API key from environment (never in code)     │
│ ├─ HTTPS only                                    │
│ └─ Rate limiting via API tier                    │
└──────────────────────────────────────────────────┘
```

## Performance Characteristics

### API Response Times (expected)

| Endpoint | Typical | P95 | Notes |
|----------|---------|-----|-------|
| Extract | 2-4s | 5s | Groq LLM latency |
| Create | 50ms | 100ms | DB insert |
| List | 100-200ms | 500ms | Depends on result size |
| Get | 20ms | 50ms | PK lookup |
| Update | 50ms | 100ms | DB update |
| Chat | 3-5s | 7s | Groq LLM latency |

### Database Performance

```
Connection Pool: 10 connections (configurable)
Max Connections: 30 (10 + 20 overflow)
Query Cache: None (can be added with Redis)
Indexes: On product_name, batch_number, status, created_at
```

### LLM Performance

```
Model: Gemma2-9b-it
Provider: Groq
Latency: 2-4 seconds (extraction)
        2-3 seconds (chat)
Cost: Based on input/output tokens
Token Limit: Varies by model
```

## Scalability Strategy

### Horizontal Scaling

1. **API Layer**
   - Multiple FastAPI instances behind load balancer
   - Stateless design (no session storage)
   - Connection pooling handles multiple instances

2. **Database Layer**
   - PostgreSQL read replicas for scaling reads
   - Primary for writes
   - Connection pooling per instance

3. **Caching**
   - Redis for frequently accessed complaints
   - Cache invalidation on updates
   - Optional: Add Memcached for session data

### Vertical Scaling

1. **API Server**
   - Increase CPU cores (multi-worker Uvicorn)
   - Increase RAM for request buffering

2. **Database**
   - Increase shared_buffers
   - Increase max_connections
   - Upgrade storage (SSD preferred)

### Load Balancing

```
├─ Nginx Load Balancer
│  ├─ Round-robin to API instances
│  ├─ Health checks (/health endpoint)
│  ├─ Connection draining on shutdown
│  └─ SSL termination
│
├─ API Instance 1
├─ API Instance 2
├─ API Instance 3
│
└─ Shared PostgreSQL Database
```

## Deployment Architectures

### Development

```
Local Machine
├─ FastAPI dev server (reload enabled)
├─ Local PostgreSQL or Docker
└─ Groq API (cloud-based)
```

### Staging

```
Linux Server
├─ Docker Container (API)
├─ Docker Container (PostgreSQL)
├─ Nginx reverse proxy
└─ Groq API (cloud-based)
```

### Production

```
Cloud Platform (AWS/GCP/Azure)
├─ Multiple API instances
│  ├─ Docker containers
│  ├─ Kubernetes orchestration (optional)
│  └─ Auto-scaling policies
├─ Managed Database
│  ├─ PostgreSQL (RDS/Cloud SQL/Managed)
│  ├─ Automated backups
│  └─ Read replicas
├─ CDN (for static content)
├─ Load Balancer (managed)
├─ Monitoring & Logging
│  ├─ Prometheus metrics
│  ├─ ELK stack (optional)
│  └─ Alerting
└─ Groq API (cloud-based)
```

## Technology Choices & Rationale

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Web Framework | FastAPI | Async, type hints, auto-docs, speed |
| ORM | SQLAlchemy | Flexible, battle-tested, good migrations |
| Database | PostgreSQL | ACID, JSON, indexing, reliability |
| LLM Framework | LangGraph | Structured workflows, error handling |
| LLM Provider | Groq | Fast inference, cost-effective |
| Validation | Pydantic | Type hints, performance, ecosystem |
| Server | Uvicorn | ASGI, async, lightweight |
| Containerization | Docker | Reproducible, portable, CI/CD |
| Orchestration | Docker Compose (or K8s) | Simple (or enterprise) deployment |

## Future Enhancements

1. **Caching Layer** - Redis for frequently accessed data
2. **Message Queue** - Celery for async complaint processing
3. **Search** - Elasticsearch for full-text complaint search
4. **Authentication** - OAuth2, API keys, role-based access
5. **Audit Logging** - All operations logged for compliance
6. **Advanced Analytics** - Complaint trend analysis, dashboards
7. **Multi-tenancy** - Support multiple organizations
8. **Workflow Engine** - Complex complaint routing & escalation
9. **Integration APIs** - ERP, LIMS, document management systems
10. **Mobile App** - Native iOS/Android applications
