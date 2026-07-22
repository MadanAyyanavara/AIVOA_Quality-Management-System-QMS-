# Frontend-Backend Integration Guide

Complete integration between React frontend and FastAPI backend for the Pharmaceutical QMS Complaint Intake System.

## Overview

The frontend is fully connected to the backend with the following features:

1. ✅ **File/Text Extraction** - `POST /api/extract`
2. ✅ **Complaint Saving** - `POST /api/complaints`
3. ✅ **AI Chat** - `POST /api/chat`
4. ✅ **Risk Analysis** (Bonus) - `POST /api/analyze-risk`

## Environment Setup

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
```

**For Production:**
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_API_TIMEOUT=30000
```

### Backend Requirements

Ensure the backend is running:

```bash
cd ..  # Go to project root
python run.py
# Server runs on http://localhost:8000
```

## API Integration Details

### 1. File Upload & Text Extraction

**Frontend:** `src/hooks/useFileUpload.ts`  
**Backend:** `POST /api/extract`

**Flow:**
```
User uploads file or pastes text
  ↓
validateFile() - Check file type and size
  ↓
extractTextFromFile() - Read file content
  ↓
extractComplaint(text) - Call backend /api/extract
  ↓
Form fields auto-populate from response
  ↓
Redux state updated
```

**Response Format:**
```json
{
  "success": true,
  "extracted_data": {
    "origin_source": "Customer",
    "customer_name": "John Doe",
    "product_name": "Aspirin",
    ...
  },
  "error": null
}
```

### 2. Save Complaint

**Frontend:** `src/components/ComplaintIntakeForm.tsx`  
**Backend:** `POST /api/complaints`

**Flow:**
```
User clicks "Save Complaint"
  ↓
validateComplaintForm() - Validate all fields
  ↓
saveComplaint(formData) - Call backend
  ↓
Success message with complaint ID
  ↓
Form auto-resets after 2 seconds
```

**Request Format:**
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
  "description": "Patient experienced severe headache",
  "initial_severity": "High",
  "priority": "High",
  "status": "Pending Triage"
}
```

### 3. AI Chat

**Frontend:** `src/components/ChatComponent.tsx`  
**Backend:** `POST /api/chat`

**Flow:**
```
User types question in chat
  ↓
User message displayed immediately
  ↓
chatWithAI(complaintContext, question) - Call backend
  ↓
AI response displayed with timestamp
  ↓
Conversation history maintained
```

**Request Format:**
```json
{
  "complaint_text": "Product: Aspirin; Batch: AB-2024-001; Description: ...",
  "question": "What severity should this be?"
}
```

### 4. Risk Analysis (Bonus Feature)

**Frontend:** `src/components/RiskAnalysisPanel.tsx`  
**Backend:** `POST /api/analyze-risk`

**Flow:**
```
User clicks "Analyze Risk" button
  ↓
validateComplaintForm() - Validate fields first
  ↓
analyzeComplaintRisk(formData) - Call backend
  ↓
Risk Analysis Panel displays results:
  - Completeness Score (0-100%)
  - Root Cause Suggestion
  - CAPA Recommendation
  - Duplicate Flag
  - Risk Level
```

**Response Format:**
```json
{
  "success": true,
  "completeness_score": 85,
  "root_cause_suggestion": "Potential manufacturing issue in batch AB-2024-001...",
  "capa_recommendation": "1) Investigate batch quality\n2) Contact customers\n3) Review process logs",
  "duplicate_flag": false,
  "risk_level": "High",
  "analysis_details": "{...}"
}
```

## API Service Layer

**Location:** `src/services/api.ts`

All API calls are centralized here with error handling:

```typescript
// Extract complaint from text
extractComplaint(text: string, onProgress?: (p: number) => void)

// Save complaint to database
saveComplaint(formData: ComplaintFormData)

// Chat with AI
chatWithAI(complaintText: string, question: string)

// Risk analysis
analyzeComplaintRisk(formData: ComplaintFormData)

// Health check
checkHealth()
```

## Error Handling

### Frontend Error Handling

1. **Validation Errors** - Displayed inline on form fields
2. **API Errors** - Caught and displayed in error messages
3. **Network Errors** - User-friendly error notifications
4. **Loading States** - Spinners shown during API calls

### Error Display Locations

- **Form:** Error messages below each field + banner
- **Save:** Status banner (saving → success/error)
- **Chat:** Error message in chat bubble
- **Risk Analysis:** Error panel with close button

### Example Error Flow

```
API Error Response
  ↓
Caught in try/catch
  ↓
Formatted error message
  ↓
Displayed to user
  ↓
User can retry or fix form
```

## Development Workflow

### Step 1: Start Backend
```bash
cd app
python run.py
# Server: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Step 2: Start Frontend
```bash
cd frontend
npm install  # First time only
npm run dev
# App: http://localhost:3000
```

### Step 3: Test Integration

1. **Extract:** Upload a file or paste text → Form auto-populates
2. **Save:** Fill form → Click Save → Complaint saved with ID
3. **Chat:** Ask question about complaint → AI responds
4. **Risk:** Click "Analyze Risk" → Detailed analysis displayed

### Step 4: Monitor API

Visit http://localhost:8000/docs to see:
- All available endpoints
- Request/response schemas
- Try-it-out interface

## Debugging

### Redux DevTools

1. Install Redux DevTools extension
2. Open DevTools → Redux tab
3. Watch state changes in real-time
4. Time-travel debug actions

### Network Inspector

1. Open browser DevTools → Network tab
2. Watch API calls and responses
3. Check request headers and payloads
4. Verify response status codes

### Console Logging

API calls are logged in console:
```
[API] Calling POST /api/extract
[API] Response: { success: true, ... }
[API] Error: Failed to save complaint
```

## Troubleshooting

### "Connection refused" / CORS Errors

**Problem:** Frontend can't reach backend

**Solutions:**
1. Check backend is running: `python run.py`
2. Check frontend env: `REACT_APP_API_URL=http://localhost:8000`
3. Clear browser cache
4. Check firewall/VPN

### File Upload Fails

**Problem:** File upload error

**Solutions:**
1. Check file type (PDF, DOCX, TXT, EML only)
2. Check file size (max 10MB)
3. Check CORS headers in backend response

### Form Not Auto-Populating

**Problem:** Extract successful but form doesn't update

**Solutions:**
1. Check Redux state in DevTools
2. Verify extracted data matches form fields
3. Check browser console for errors
4. Try uploading a different file

### Chat Not Responding

**Problem:** Chat message not responding

**Solutions:**
1. Check API key: `GROQ_API_KEY` set
2. Check complaint context is provided
3. Try simpler question first
4. Check backend logs for errors

### Risk Analysis Error

**Problem:** Risk analysis fails

**Solutions:**
1. Validate all form fields filled
2. Check backend has Groq API key
3. Try with completed form
4. Check backend logs

## Performance Tips

1. **Lazy Loading:** Use React.lazy for components
2. **Memoization:** Use React.memo for expensive components
3. **Redux Selectors:** Use memoized selectors
4. **API Caching:** Implement response caching
5. **Bundle Size:** Use code splitting

## Security Considerations

1. **API Key:** Never expose `GROQ_API_KEY` in frontend
2. **CORS:** Whitelist specific domains in production
3. **Validation:** Validate on both client and server
4. **Authentication:** Add JWT/OAuth when needed
5. **HTTPS:** Use HTTPS in production

## Deployment

### Production Build

```bash
cd frontend
npm run build
# Creates optimized build in build/ directory
```

### Environment Variables (Production)

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_API_TIMEOUT=30000
```

### Deployment Options

1. **Vercel** - Recommended for React apps
2. **Netlify** - Alternative
3. **AWS S3 + CloudFront** - Cost-effective
4. **Docker** - Self-hosted option

## Testing Integration

### Manual Testing Checklist

- [ ] Extract from PDF file
- [ ] Extract from DOCX file
- [ ] Extract from TXT file
- [ ] Extract from pasted text
- [ ] Form auto-populates correctly
- [ ] Save complaint with all fields
- [ ] Verify complaint ID returned
- [ ] Chat responds to questions
- [ ] Risk analysis provides scores
- [ ] Error messages display correctly
- [ ] Loading spinners show
- [ ] Network errors handled gracefully

### Automated Testing

```bash
npm test
# Run Jest tests
# Tests in src/__tests__/ directory
```

## Next Steps

1. ✅ Connect extraction API
2. ✅ Connect save API
3. ✅ Connect chat API
4. ✅ Implement risk analysis
5. ⬜ Add authentication (JWT/OAuth)
6. ⬜ Add complaint history/search
7. ⬜ Add export to PDF/CSV
8. ⬜ Add real-time updates (WebSocket)
9. ⬜ Add monitoring/analytics
10. ⬜ Deploy to production

## Support

For issues:
1. Check this guide first
2. Review Redux DevTools state
3. Check backend logs
4. Review network requests
5. Check console errors

---

**Integration Complete!** ✅

The frontend and backend are fully connected and ready for production use.
