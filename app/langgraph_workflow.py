"""
LangGraph workflow for extracting complaint information from raw text using Groq.
"""
from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel, Field, ValidationError
from typing import Optional
from datetime import date
import json
import logging
from app.config import settings

logger = logging.getLogger(__name__)


class ExtractedComplaint(BaseModel):
    """Structured complaint data extracted from raw text."""
    origin_source: str = Field(..., description="Source of complaint (e.g., Customer, Doctor, Hospital)")
    customer_name: Optional[str] = Field(None, description="Name of the customer/reporter")
    product_name: str = Field(..., description="Name of the pharmaceutical product")
    product_strength: Optional[str] = Field(None, description="Strength of the product (e.g., 500mg)")
    batch_number: str = Field(..., description="Batch/Lot number of the product")
    mfg_date: Optional[date] = Field(None, description="Manufacturing date in YYYY-MM-DD format")
    expiry_date: Optional[date] = Field(None, description="Expiry date in YYYY-MM-DD format")
    quantity_affected: Optional[str] = Field(None, description="Quantity affected by the complaint")
    complaint_type: str = Field(..., description="Type of complaint (e.g., Defective Product, Wrong Strength)")
    complaint_date: date = Field(..., description="Date of complaint in YYYY-MM-DD format")
    description: str = Field(..., description="Detailed description of the complaint")
    initial_severity: str = Field(
        default="Medium",
        description="Initial severity level: Low, Medium, High, or Critical"
    )
    priority: Optional[str] = Field(None, description="Priority level (High, Normal, Low)")


class ExtractionState(BaseModel):
    """State object for the extraction workflow."""
    raw_text: str
    extracted_data: Optional[ExtractedComplaint] = None
    error: Optional[str] = None
    extraction_attempts: int = 0


def create_extraction_prompt() -> str:
    """Create the system prompt for complaint extraction."""
    return """You are an expert pharmaceutical quality analyst specializing in complaint intake and processing.

Your task is to extract structured information from complaint text and return it as valid JSON.

IMPORTANT RULES:
1. Extract ALL available information from the text
2. Dates must be in YYYY-MM-DD format. If only partial date info is available, do your best to infer or use None
3. Severity levels must be one of: "Low", "Medium", "High", "Critical"
4. Always infer the severity based on complaint type and description:
   - Critical: Patient harm, death, serious injury, batch-wide issues
   - High: Significant defects, multiple units affected, potential risk
   - Medium: Minor defects, isolated issues, low patient impact
   - Low: Documentation issues, cosmetic defects, minimal impact
5. If information is not available, use null (JSON null, not string "null")
6. Return ONLY valid JSON, no additional text

Expected JSON structure:
{
  "origin_source": "string",
  "customer_name": "string or null",
  "product_name": "string",
  "product_strength": "string or null",
  "batch_number": "string",
  "mfg_date": "YYYY-MM-DD or null",
  "expiry_date": "YYYY-MM-DD or null",
  "quantity_affected": "string or null",
  "complaint_type": "string",
  "complaint_date": "YYYY-MM-DD",
  "description": "string",
  "initial_severity": "Low|Medium|High|Critical",
  "priority": "High|Normal|Low or null"
}"""


def extraction_node(state: ExtractionState) -> ExtractionState:
    """
    Node that calls Groq API to extract complaint information.
    """
    try:
        # Initialize Groq LLM
        llm = ChatGroq(
            model="gemma2-9b-it",
            groq_api_key=settings.groq_api_key,
            temperature=0.1,  # Low temperature for consistent extraction
        )

        # Prepare messages
        system_prompt = create_extraction_prompt()
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Extract complaint information from this text:\n\n{state.raw_text}")
        ]

        # Call LLM
        response = llm.invoke(messages)
        response_text = response.content.strip()

        # Parse JSON response
        try:
            extracted_dict = json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed: {e}. Response: {response_text}")
            state.error = f"Failed to parse LLM response as JSON: {str(e)}"
            state.extraction_attempts += 1
            return state

        # Validate against Pydantic model
        extracted_data = ExtractedComplaint(**extracted_dict)
        state.extracted_data = extracted_data
        logger.info(f"Successfully extracted complaint: {extracted_data.product_name} (batch: {extracted_data.batch_number})")

    except ValidationError as e:
        logger.error(f"Validation error: {e}")
        state.error = f"Extracted data validation failed: {str(e)}"
        state.extraction_attempts += 1

    except Exception as e:
        logger.error(f"Extraction error: {e}")
        state.error = f"Extraction failed: {str(e)}"
        state.extraction_attempts += 1

    return state


def build_extraction_workflow():
    """Build and compile the LangGraph extraction workflow."""
    workflow = StateGraph(ExtractionState)

    # Add extraction node
    workflow.add_node("extract", extraction_node)

    # Define edges
    workflow.add_edge(START, "extract")
    workflow.add_edge("extract", END)

    return workflow.compile()


# Compile the workflow at module load time
extraction_workflow = build_extraction_workflow()


async def extract_complaint_from_text(raw_text: str) -> dict:
    """
    Extract complaint information from raw text using LangGraph workflow.

    Args:
        raw_text: Raw complaint text or document content

    Returns:
        Dictionary with 'success' (bool), 'data' (ExtractedComplaint), and 'error' (str)
    """
    try:
        # Initialize state
        initial_state = ExtractionState(raw_text=raw_text)

        # Run workflow
        result = extraction_workflow.invoke(initial_state)

        if isinstance(result, dict):
            error = result.get("error")
            extracted_data = result.get("extracted_data")

            if error:
                return {
                    "success": False,
                    "data": None,
                    "error": error
                }

            if isinstance(extracted_data, dict):
                extracted_data = ExtractedComplaint(**extracted_data)

            return {
                "success": True,
                "data": extracted_data,
                "error": None
            }

        if getattr(result, "error", None):
            return {
                "success": False,
                "data": None,
                "error": result.error
            }

        return {
            "success": True,
            "data": result.extracted_data,
            "error": None
        }

    except Exception as e:
        logger.error(f"Workflow execution failed: {e}")
        return {
            "success": False,
            "data": None,
            "error": f"Workflow error: {str(e)}"
        }


# ============================================================================
# BONUS FEATURE: Risk Analysis Workflow
# ============================================================================

def create_risk_analysis_prompt() -> str:
    """Create the system prompt for complaint risk analysis."""
    return """You are an expert pharmaceutical quality and regulatory analyst. You analyze complaints
to provide risk assessments, completeness scores, and preventive action recommendations.

ANALYZE the complaint and provide JSON response with:
1. completeness_score (0-100): Assess if all critical fields are filled (product, batch, description, etc.)
2. root_cause_suggestion: Initial hypothesis about the root cause
3. capa_recommendation: Suggested Corrective & Preventive Actions
4. duplicate_flag (true/false): Is this likely a duplicate based on batch/product/date patterns?
5. risk_level: "Low", "Medium", "High", or "Critical" based on severity and completeness

SCORING RULES:
- Completeness: 100% if all fields present, 80% if one field missing, 60% if 2+ fields missing, below 60% if critical fields missing
- Risk Level: Critical if severity=Critical, High if High+low completeness, Medium if Medium severity or low data, Low if Low severity+complete data

Return ONLY valid JSON with no markdown formatting."""


async def analyze_complaint_risk_langraph(complaint: any) -> dict:
    """
    Bonus Feature: Analyze complaint risk using LangGraph + Groq.

    Args:
        complaint: ComplaintCreate object with form data

    Returns:
        Dictionary with risk analysis results
    """
    try:
        # Initialize Groq LLM
        llm = ChatGroq(
            model="gemma2-9b-it",
            groq_api_key=settings.groq_api_key,
            temperature=0.1,
        )

        # Build complaint summary for analysis
        complaint_summary = f"""
        Product: {complaint.product_name}
        Batch: {complaint.batch_number}
        Severity: {complaint.initial_severity}
        Type: {complaint.complaint_type}
        Date: {complaint.complaint_date}
        Description: {complaint.description}
        Mfg Date: {complaint.mfg_date or 'Not provided'}
        Expiry Date: {complaint.expiry_date or 'Not provided'}
        Customer: {complaint.customer_name or 'Not provided'}
        """

        # Create messages
        system_prompt = create_risk_analysis_prompt()
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Analyze this complaint for risk:\n\n{complaint_summary}"),
        ]

        # Call LLM
        response = llm.invoke(messages)
        response_text = response.content.strip()

        # Parse JSON response
        try:
            analysis_data = json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed in risk analysis: {e}. Response: {response_text}")
            # Return default analysis if parsing fails
            return {
                "success": True,
                "completeness_score": 60,
                "root_cause_suggestion": "Unable to parse AI analysis - please review manually",
                "capa_recommendation": "Review complaint details thoroughly",
                "duplicate_flag": False,
                "risk_level": complaint.initial_severity or "Medium",
                "analysis_details": "Analysis parsing error",
            }

        # Validate and return results
        return {
            "success": True,
            "completeness_score": min(100, max(0, analysis_data.get("completeness_score", 60))),
            "root_cause_suggestion": analysis_data.get(
                "root_cause_suggestion",
                "Insufficient data for detailed analysis"
            ),
            "capa_recommendation": analysis_data.get(
                "capa_recommendation",
                "Recommend standard complaint investigation protocol"
            ),
            "duplicate_flag": analysis_data.get("duplicate_flag", False),
            "risk_level": analysis_data.get("risk_level", complaint.initial_severity),
            "analysis_details": json.dumps(analysis_data, indent=2),
        }

    except Exception as e:
        logger.error(f"Risk analysis error: {e}")
        return {
            "success": False,
            "error": f"Risk analysis failed: {str(e)}",
        }
