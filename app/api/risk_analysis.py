"""
Bonus Feature: API endpoints for complaint risk analysis using LangGraph.
Provides completeness scoring, root cause suggestions, CAPA recommendations, and duplicate detection.
"""
from fastapi import APIRouter, HTTPException
from app.schemas import ComplaintCreate
from app.langgraph_workflow import analyze_complaint_risk_langraph
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["risk-analysis"])


@router.post("/analyze-risk")
async def analyze_complaint_risk(complaint: ComplaintCreate):
    """
    Bonus Feature: Analyze complaint for risk, completeness, and potential duplicates.

    Uses LangGraph to evaluate:
    1. Complaint Completeness Score (0-100%) - how much critical information is provided
    2. Root Cause Suggestion - AI-powered initial root cause analysis
    3. CAPA Recommendation - Corrective & Preventive Action suggestion
    4. Duplicate Flag - Whether this may be a duplicate complaint

    Returns:
        {
            "success": bool,
            "completeness_score": int (0-100),
            "root_cause_suggestion": str,
            "capa_recommendation": str,
            "duplicate_flag": bool,
            "risk_level": "Low" | "Medium" | "High" | "Critical",
            "analysis_details": str
        }
    """
    try:
        logger.info(f"Starting risk analysis for complaint: {complaint.product_name}, Batch: {complaint.batch_number}")

        # Run LangGraph risk analysis workflow
        result = await analyze_complaint_risk_langraph(complaint)

        if result["success"]:
            return {
                "success": True,
                "completeness_score": result["completeness_score"],
                "root_cause_suggestion": result["root_cause_suggestion"],
                "capa_recommendation": result["capa_recommendation"],
                "duplicate_flag": result["duplicate_flag"],
                "risk_level": result["risk_level"],
                "analysis_details": result.get("analysis_details", ""),
            }
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Risk analysis failed: {result.get('error', 'Unknown error')}"
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Risk analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to analyze complaint risk")
