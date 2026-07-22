"""
API endpoints for complaint data extraction using LangGraph.
"""
from fastapi import APIRouter, HTTPException
from app.schemas import ExtractRequest, ExtractionResponse, ComplaintExtract
from app.langgraph_workflow import extract_complaint_from_text
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["extraction"])


@router.post("/extract", response_model=ExtractionResponse)
async def extract_complaint(request: ExtractRequest) -> ExtractionResponse:
    """
    Extract complaint information from raw text using LangGraph and Groq.

    The endpoint accepts raw complaint text or document content, processes it through
    the LangGraph extraction workflow, and returns structured complaint data.

    Args:
        request: Contains raw complaint text

    Returns:
        ExtractionResponse with extracted fields or error message

    Example:
        {
            "text": "Customer reported on 2024-01-15 that Aspirin batch AB123..."
        }
    """
    try:
        # Validate input length
        if len(request.text) > 50000:
            raise HTTPException(
                status_code=400,
                detail="Text input exceeds maximum length of 50,000 characters"
            )

        # Run extraction workflow
        result = await extract_complaint_from_text(request.text)

        if result["success"]:
            # Convert Pydantic model to dict for response
            extracted_dict = result["data"].model_dump(exclude_none=False)
            extracted_response = ComplaintExtract(**extracted_dict)

            return ExtractionResponse(
                success=True,
                extracted_data=extracted_response,
                error=None
            )
        else:
            return ExtractionResponse(
                success=False,
                extracted_data=None,
                error=result["error"]
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Extraction endpoint error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal extraction error")
