# Pharmaceutical QMS - API Documentation

## Overview

The Pharmaceutical Quality Management System (QMS) Complaint Intake API provides endpoints for:
- Extracting complaint data from raw text using AI (LangGraph + Groq)
- Managing complaint records in the database
- Interactive chat about complaint details

**Base URL:** `http://localhost:8000`

**API Version:** 1.0.0

## Authentication

Currently, the API does not require authentication. For production deployment, implement API key or OAuth2 authentication.

## Response Format

All responses are in JSON format.

### Success Response

```json
{
  "data": {},
  "success": true
}
```

### Error Response

```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Endpoints

### Health & Status

#### GET /health

Check API health status.

**Response:** `200 OK`

```json
{
  "status": "healthy",
  "service": "Pharmaceutical QMS - Complaint Intake API",
  "version": "1.0.0"
}
```

---

### Extraction Endpoints

#### POST /api/extract

Extract structured complaint data from raw text using LangGraph and Groq.

**Request Body:**
```json
{
  "text": "Raw complaint text or document content (required, max 50,000 chars)"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "extracted_data": {
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
    "description": "Patient experienced severe headache",
    "initial_severity": "High",
    "priority": "High"
  },
  "error": null
}
```

**Error Response:** `400/500`
```json
{
  "success": false,
  "extracted_data": null,
  "error": "Description of what failed"
}
```

**Notes:**
- Dates are automatically formatted as YYYY-MM-DD
- Severity is inferred from complaint content
- Null values indicate missing/unavailable information

---

### Complaint Management Endpoints

#### POST /api/complaints

Create a new complaint record in the database.

**Request Body:**
```json
{
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
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
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
  "status": "Pending Triage",
  "created_at": "2024-01-16T10:30:00",
  "updated_at": "2024-01-16T10:30:00"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| origin_source | string | Yes | Source of complaint (Customer, Doctor, Hospital, etc.) |
| customer_name | string | No | Name of reporter |
| product_name | string | Yes | Pharmaceutical product name |
| product_strength | string | No | Strength (e.g., 500mg, 10%) |
| batch_number | string | Yes | Batch/Lot number |
| mfg_date | date | No | Manufacturing date (YYYY-MM-DD) |
| expiry_date | date | No | Expiry date (YYYY-MM-DD) |
| quantity_affected | string | No | Quantity affected (e.g., "2 bottles", "10 tablets") |
| complaint_type | string | Yes | Type (Defective Product, Wrong Strength, Adverse Effect, etc.) |
| complaint_date | date | Yes | Date complaint was made (YYYY-MM-DD) |
| description | string | Yes | Detailed complaint description |
| initial_severity | enum | Yes | Low, Medium, High, Critical (default: Medium) |
| priority | string | No | High, Normal, Low |
| status | enum | Yes | Pending Triage, In Investigation, Resolved, Closed |

---

#### GET /api/complaints

List complaints with filtering and pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| skip | integer | 0 | Number of records to skip |
| limit | integer | 10 | Number of records to return (max 100) |
| status | string | - | Filter by status |
| product_name | string | - | Filter by product name (partial match, case-insensitive) |
| batch_number | string | - | Filter by batch number (partial match, case-insensitive) |

**Examples:**

All complaints:
```
GET /api/complaints
```

With pagination:
```
GET /api/complaints?skip=0&limit=20
```

Filter by status:
```
GET /api/complaints?status=Pending%20Triage
```

Filter by product:
```
GET /api/complaints?product_name=Aspirin
```

Multiple filters:
```
GET /api/complaints?product_name=Aspirin&batch_number=AB&status=In%20Investigation&limit=50
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
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
    "description": "Patient experienced severe headache",
    "initial_severity": "High",
    "priority": "High",
    "status": "Pending Triage",
    "created_at": "2024-01-16T10:30:00",
    "updated_at": "2024-01-16T10:30:00"
  }
]
```

---

#### GET /api/complaints/{complaint_id}

Get a specific complaint by ID.

**Path Parameters:**
- `complaint_id` (integer, required): ID of the complaint

**Response:** `200 OK`
```json
{
  "id": 1,
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
  "description": "Patient experienced severe headache",
  "initial_severity": "High",
  "priority": "High",
  "status": "Pending Triage",
  "created_at": "2024-01-16T10:30:00",
  "updated_at": "2024-01-16T10:30:00"
}
```

**Error Response:** `404 Not Found`
```json
{
  "detail": "Complaint not found"
}
```

---

#### PUT /api/complaints/{complaint_id}

Update an existing complaint.

**Path Parameters:**
- `complaint_id` (integer, required): ID of the complaint to update

**Request Body:**
Same as POST /api/complaints

**Response:** `200 OK`
Same as POST /api/complaints

**Error Response:** `404 Not Found`
```json
{
  "detail": "Complaint not found"
}
```

---

### Chat Endpoints

#### POST /api/chat

Interactive chat about complaint details using Groq AI.

**Request Body:**
```json
{
  "complaint_text": "Patient reported headache after taking Aspirin batch AB-2024-001 on 2024-01-15",
  "question": "What is the initial severity level for this complaint and why?"
}
```

**Response:** `200 OK`
```json
{
  "answer": "Based on the complaint details, the initial severity level would be HIGH. The reason is that while a headache is a concerning adverse effect that requires investigation, it's not immediately life-threatening like a severe allergic reaction would be. However, it's elevated from MEDIUM because: 1) It represents a potential adverse drug event that needs investigation, 2) It affects product safety perception, 3) It may require batch investigation...",
  "success": true
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "detail": "Failed to generate response from AI model"
}
```

**Notes:**
- Complaint text limited to 50,000 characters
- Questions limited to 5,000 characters
- Uses Gemma 2 9B model from Groq

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Data Models

### SeverityLevel Enum
```
- Low: Minimal impact, documentation issues
- Medium: Minor defects, isolated issues
- High: Significant defects, multiple units affected
- Critical: Patient harm, death, serious injury
```

### ComplaintStatus Enum
```
- Pending Triage: Initial intake, not yet reviewed
- In Investigation: Being actively investigated
- Resolved: Issue resolved with action taken
- Closed: Complaint formally closed
```

---

## Usage Examples

### Complete Complaint Workflow

1. **Extract from raw text:**
```bash
curl -X POST "http://localhost:8000/api/extract" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "On January 15, 2024, customer John Doe called about Aspirin batch AB-2024-001 (500mg, mfg 6/10/2023, exp 6/10/2025). He purchased 2 bottles and reported that both caused headaches. Product type is adverse effect."
  }'
```

2. **Create complaint with extracted data:**
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
    "description": "Customer reported headaches after taking the product",
    "initial_severity": "High",
    "priority": "High",
    "status": "Pending Triage"
  }'
```

3. **Chat about complaint:**
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "complaint_text": "Customer John Doe reported headaches from Aspirin batch AB-2024-001 on 2024-01-15",
    "question": "Should we issue a recall for this batch? What factors should we consider?"
  }'
```

---

## Rate Limiting

Not currently implemented. Implement in production based on your requirements.

---

## Security Considerations

1. **Input Validation:** All inputs are validated
2. **SQL Injection:** SQLAlchemy ORM prevents SQL injection
3. **CORS:** Configure allowed origins in production
4. **API Keys:** Implement authentication for production
5. **Data Encryption:** Use HTTPS in production
6. **Audit Logging:** Log all complaints and changes

---

## Performance

- Database connection pooling: 10 connections (configurable)
- API documentation auto-generated: /docs, /redoc
- Async/await for I/O operations
- Index on frequently filtered columns

---

## Support

Refer to the SETUP.md file for installation and troubleshooting.
