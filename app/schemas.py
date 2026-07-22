from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from enum import Enum


class SeverityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class ComplaintStatus(str, Enum):
    PENDING_TRIAGE = "Pending Triage"
    IN_INVESTIGATION = "In Investigation"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


class ComplaintExtract(BaseModel):
    """Extracted complaint data from raw text (LangGraph output)."""
    origin_source: str
    customer_name: Optional[str] = None
    product_name: str
    product_strength: Optional[str] = None
    batch_number: str
    mfg_date: Optional[date] = None
    expiry_date: Optional[date] = None
    quantity_affected: Optional[str] = None
    complaint_type: str
    complaint_date: date
    description: str
    initial_severity: SeverityLevel = SeverityLevel.MEDIUM
    priority: Optional[str] = None


class ComplaintCreate(BaseModel):
    """Request schema for creating a new complaint."""
    origin_source: str
    customer_name: Optional[str] = None
    product_name: str
    product_strength: Optional[str] = None
    batch_number: str
    mfg_date: Optional[date] = None
    expiry_date: Optional[date] = None
    quantity_affected: Optional[str] = None
    complaint_type: str
    complaint_date: date
    description: str
    initial_severity: SeverityLevel = SeverityLevel.MEDIUM
    priority: Optional[str] = None
    status: ComplaintStatus = ComplaintStatus.PENDING_TRIAGE


class ComplaintResponse(BaseModel):
    """Response schema for complaint data."""
    id: int
    origin_source: str
    customer_name: Optional[str]
    product_name: str
    product_strength: Optional[str]
    batch_number: str
    mfg_date: Optional[date]
    expiry_date: Optional[date]
    quantity_affected: Optional[str]
    complaint_type: str
    complaint_date: date
    description: str
    initial_severity: SeverityLevel
    priority: Optional[str]
    status: ComplaintStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExtractRequest(BaseModel):
    """Request schema for extraction endpoint."""
    text: str = Field(..., min_length=1, description="Raw complaint text or document content")


class ExtractionResponse(BaseModel):
    """Response schema for extraction endpoint."""
    success: bool
    extracted_data: Optional[ComplaintExtract] = None
    error: Optional[str] = None


class ChatRequest(BaseModel):
    """Request schema for chat endpoint."""
    complaint_text: str = Field(..., min_length=1, description="The complaint text")
    question: str = Field(..., min_length=1, description="User question about the complaint")


class ChatResponse(BaseModel):
    """Response schema for chat endpoint."""
    answer: str
    success: bool
