"""
API endpoints for complaint database operations.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db, DB_AVAILABLE
from app.models import Complaint, ComplaintStatus, SeverityLevel
from app.schemas import ComplaintCreate, ComplaintResponse
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["complaints"])


@router.post("/complaints", response_model=ComplaintResponse, status_code=201)
def create_complaint(
    complaint: ComplaintCreate,
    db: Optional[Session] = Depends(get_db)
) -> ComplaintResponse:
    """
    Create a new complaint record in the database.

    Args:
        complaint: Complaint data to save
        db: Database session

    Returns:
        Created complaint with ID and timestamps

    Example:
        {
            "origin_source": "Customer",
            "customer_name": "John Doe",
            "product_name": "Aspirin",
            ...
        }
    """
    if not DB_AVAILABLE or db is None:
        raise HTTPException(
            status_code=503,
            detail="Database is not available. AI features (extraction, chat, risk analysis) are working, but complaint storage is disabled."
        )

    try:
        # Create new complaint record
        db_complaint = Complaint(
            origin_source=complaint.origin_source,
            customer_name=complaint.customer_name,
            product_name=complaint.product_name,
            product_strength=complaint.product_strength,
            batch_number=complaint.batch_number,
            mfg_date=complaint.mfg_date,
            expiry_date=complaint.expiry_date,
            quantity_affected=complaint.quantity_affected,
            complaint_type=complaint.complaint_type,
            complaint_date=complaint.complaint_date,
            description=complaint.description,
            initial_severity=complaint.initial_severity,
            priority=complaint.priority,
            status=complaint.status,
        )

        db.add(db_complaint)
        db.commit()
        db.refresh(db_complaint)

        logger.info(
            f"Created complaint ID {db_complaint.id}: "
            f"Product={db_complaint.product_name}, Batch={db_complaint.batch_number}"
        )

        return ComplaintResponse.model_validate(db_complaint)

    except HTTPException:
        raise
    except Exception as e:
        if db:
            db.rollback()
        logger.error(f"Error creating complaint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create complaint")


@router.get("/complaints", response_model=List[ComplaintResponse])
def list_complaints(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Number of records to return"),
    status: str = Query(None, description="Filter by status"),
    product_name: str = Query(None, description="Filter by product name (partial match)"),
    batch_number: str = Query(None, description="Filter by batch number (partial match)"),
    db: Optional[Session] = Depends(get_db)
) -> List[ComplaintResponse]:
    """
    List complaints with optional filtering and pagination.

    Args:
        skip: Number of records to skip (pagination)
        limit: Number of records to return (max 100)
        status: Filter by complaint status
        product_name: Filter by product name (case-insensitive partial match)
        batch_number: Filter by batch number (case-insensitive partial match)
        db: Database session

    Returns:
        List of complaints

    Example:
        GET /api/complaints?skip=0&limit=20&status=Pending%20Triage
    """
    if not DB_AVAILABLE or db is None:
        return []

    try:
        query = db.query(Complaint)

        # Apply filters
        if status:
            try:
                status_enum = ComplaintStatus(status)
                query = query.filter(Complaint.status == status_enum)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid status. Must be one of: {', '.join([s.value for s in ComplaintStatus])}"
                )

        if product_name:
            query = query.filter(Complaint.product_name.ilike(f"%{product_name}%"))

        if batch_number:
            query = query.filter(Complaint.batch_number.ilike(f"%{batch_number}%"))

        # Execute query with pagination
        complaints = query.order_by(desc(Complaint.created_at)).offset(skip).limit(limit).all()

        return [ComplaintResponse.model_validate(c) for c in complaints]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing complaints: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to list complaints")


@router.get("/complaints/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: int,
    db: Optional[Session] = Depends(get_db)
) -> ComplaintResponse:
    """
    Get a specific complaint by ID.

    Args:
        complaint_id: ID of the complaint
        db: Database session

    Returns:
        Complaint details

    Example:
        GET /api/complaints/42
    """
    if not DB_AVAILABLE or db is None:
        raise HTTPException(
            status_code=503,
            detail="Database is not available. Cannot retrieve complaint details."
        )

    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    return ComplaintResponse.model_validate(complaint)


@router.put("/complaints/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(
    complaint_id: int,
    complaint_data: ComplaintCreate,
    db: Optional[Session] = Depends(get_db)
) -> ComplaintResponse:
    """
    Update an existing complaint record.

    Args:
        complaint_id: ID of the complaint to update
        complaint_data: Updated complaint data
        db: Database session

    Returns:
        Updated complaint

    Example:
        PUT /api/complaints/42
    """
    if not DB_AVAILABLE or db is None:
        raise HTTPException(
            status_code=503,
            detail="Database is not available. Cannot update complaint."
        )

    try:
        complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

        if not complaint:
            raise HTTPException(status_code=404, detail="Complaint not found")

        # Update fields
        complaint.origin_source = complaint_data.origin_source
        complaint.customer_name = complaint_data.customer_name
        complaint.product_name = complaint_data.product_name
        complaint.product_strength = complaint_data.product_strength
        complaint.batch_number = complaint_data.batch_number
        complaint.mfg_date = complaint_data.mfg_date
        complaint.expiry_date = complaint_data.expiry_date
        complaint.quantity_affected = complaint_data.quantity_affected
        complaint.complaint_type = complaint_data.complaint_type
        complaint.complaint_date = complaint_data.complaint_date
        complaint.description = complaint_data.description
        complaint.initial_severity = complaint_data.initial_severity
        complaint.priority = complaint_data.priority
        complaint.status = complaint_data.status

        db.commit()
        db.refresh(complaint)

        logger.info(f"Updated complaint ID {complaint_id}")

        return ComplaintResponse.model_validate(complaint)

    except HTTPException:
        raise
    except Exception as e:
        if db:
            db.rollback()
        logger.error(f"Error updating complaint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update complaint")
