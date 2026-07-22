from sqlalchemy import Column, String, DateTime, Integer, Text, Enum, Date
from sqlalchemy.sql import func
from datetime import datetime
import enum
from app.database import Base


class SeverityLevel(str, enum.Enum):
    """Complaint severity levels."""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class ComplaintStatus(str, enum.Enum):
    """Complaint workflow status."""
    PENDING_TRIAGE = "Pending Triage"
    IN_INVESTIGATION = "In Investigation"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


class Complaint(Base):
    """SQLAlchemy model for pharmaceutical complaints."""
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    # Origin and Customer Information
    origin_source = Column(String(100), nullable=False, index=True)
    customer_name = Column(String(255), nullable=True)

    # Product Information
    product_name = Column(String(255), nullable=False, index=True)
    product_strength = Column(String(100), nullable=True)
    batch_number = Column(String(100), nullable=False, index=True)
    mfg_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    quantity_affected = Column(String(100), nullable=True)

    # Complaint Details
    complaint_type = Column(String(100), nullable=False)
    complaint_date = Column(Date, nullable=False)
    description = Column(Text, nullable=False)

    # Classification
    initial_severity = Column(
        Enum(SeverityLevel),
        nullable=False,
        default=SeverityLevel.MEDIUM
    )
    priority = Column(String(50), nullable=True)
    status = Column(
        Enum(ComplaintStatus),
        nullable=False,
        default=ComplaintStatus.PENDING_TRIAGE,
        index=True
    )

    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Complaint(id={self.id}, product={self.product_name}, batch={self.batch_number})>"
