"""
API endpoints for interactive chat about complaints using Groq.
"""
from fastapi import APIRouter, HTTPException
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.schemas import ChatRequest, ChatResponse
from app.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["chat"])


def create_complaint_system_prompt() -> str:
    """Create the system prompt for complaint analysis chat."""
    return """You are a pharmaceutical quality management expert. You specialize in:
- Analyzing product complaints and quality issues
- Providing professional assessments based on complaint details
- Offering recommendations for investigation and resolution
- Ensuring patient safety and regulatory compliance

Always provide clear, professional, and accurate responses based on the complaint information provided.
When asked about severity or priority, consider patient safety implications, product scope, and regulatory requirements."""


@router.post("/chat", response_model=ChatResponse)
async def chat_about_complaint(request: ChatRequest) -> ChatResponse:
    """
    Interactive chat endpoint for discussing complaint details with Groq.

    Allows users to ask questions about a specific complaint and get expert
    pharmaceutical quality analysis and recommendations.

    Args:
        request: Contains complaint text and a question

    Returns:
        ChatResponse with the answer and success status

    Example:
        {
            "complaint_text": "Patient reported headache after taking our Aspirin batch AB123...",
            "question": "What is the initial severity level for this complaint?"
        }
    """
    try:
        # Validate input lengths
        if len(request.complaint_text) > 50000:
            raise HTTPException(
                status_code=400,
                detail="Complaint text exceeds maximum length of 50,000 characters"
            )

        if len(request.question) > 5000:
            raise HTTPException(
                status_code=400,
                detail="Question exceeds maximum length of 5,000 characters"
            )

        # Initialize Groq LLM
        llm = ChatGroq(
            model="gemma2-9b-it",
            groq_api_key=settings.groq_api_key,
            temperature=0.7,  # Balanced for conversation
        )

        # Prepare messages
        system_prompt = create_complaint_system_prompt()
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(
                content=(
                    f"Here is the complaint information:\n\n{request.complaint_text}\n\n"
                    f"Question: {request.question}"
                )
            )
        ]

        # Get response from Groq
        response = llm.invoke(messages)
        answer = response.content.strip()

        logger.info(f"Chat response generated for question: {request.question[:50]}...")

        return ChatResponse(
            answer=answer,
            success=True
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate response from AI model"
        )
