from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

router = APIRouter()

# Medical chat session storage (in-memory for now)
chat_sessions = {}

class MedicalQuery(BaseModel):
    message: str
    session_id: Optional[str] = None

class MedicalResponse(BaseModel):
    message: str
    confidence_score: float
    doctor_recommended: bool
    doctor_reason: Optional[str] = None
    session_id: str
    suggestions: List[str] = []

class FeedbackRequest(BaseModel):
    session_id: str
    message_id: str
    is_correct: bool
    feedback_text: Optional[str] = None

@router.post("/medical-chat", response_model=MedicalResponse)
async def medical_chat(query: MedicalQuery):
    """
    Healthcare AI chat endpoint with confidence scoring and doctor recommendations
    """
    try:
        # Create or get session
        session_id = query.session_id or str(uuid.uuid4())
        
        # Initialize LLM chat with improved conversational system prompt
        chat = LlmChat(
            api_key=os.getenv("EMERGENT_LLM_KEY"),
            session_id=session_id,
            system_message="""You are a friendly, knowledgeable Healthcare AI Assistant named "HealthBot". 
You're here to help users with medical concerns in a warm, conversational way.

PERSONALITY:
- Greet users warmly (e.g., "Hi buddy! What's on your mind today? Feel free to describe any health concerns.")
- Be empathetic and supportive
- Use simple, clear language (not overly technical)
- Show genuine care for the user's wellbeing

RESPONSE FORMAT:
For greetings ("hi", "hello"):
- Respond warmly and ask what they need help with

For medical queries:
1. **Understanding**: Briefly acknowledge their concern
2. **What's Happening**: Explain the condition in simple terms (2-3 sentences)
3. **Common Causes**: List 3-4 main causes with brief explanations
4. **What You Can Do**: Provide 3-4 actionable self-care suggestions
5. **When to Seek Help**: Clear criteria for when to see a doctor

IMPORTANT RULES:
- Keep responses under 200 words total
- Use bullet points and short paragraphs
- Be conversational, not robotic
- Always mention if doctor visit is needed
- End with offering to answer follow-up questions

Example for "I have mild fever":
"I understand you're dealing with a mild fever. Let me help!

**What's Happening**: Your body temperature is slightly elevated (usually 99-100.9°F). This is your body's natural response to fighting something.

**Common Causes**:
• Viral infections (cold, flu)
• Minor bacterial infections
• Heat exhaustion
• Recent vaccination

**What You Can Do**:
• Rest and stay hydrated
• Take acetaminophen if needed
• Dress lightly, cool compress
• Monitor your temperature

**See a Doctor If**: Fever above 103°F, lasts more than 3 days, or you have severe symptoms.

Would you like to know more about any specific aspect?"
"""
        ).with_model("openai", "gpt-5.1")
        
        # Send user message
        user_message = UserMessage(text=query.message)
        
        response = await chat.send_message(user_message)
        
        # Calculate confidence based on response certainty keywords
        confidence = calculate_confidence(response, query.message)
        
        # Determine if doctor visit needed
        doctor_needed = check_doctor_recommendation(query.message, response)
        doctor_reason = None
        if doctor_needed:
            doctor_reason = "Based on your symptoms, it's recommended to consult with a healthcare professional for proper diagnosis and treatment."
        
        # Generate suggestions
        suggestions = generate_suggestions(query.message, response)
        
        # Store in session history
        if session_id not in chat_sessions:
            chat_sessions[session_id] = []
        
        chat_sessions[session_id].append({
            "query": query.message,
            "response": response,
            "timestamp": datetime.utcnow().isoformat(),
            "confidence": confidence,
            "doctor_needed": doctor_needed
        })
        
        return MedicalResponse(
            message=response,
            confidence_score=confidence,
            doctor_recommended=doctor_needed,
            doctor_reason=doctor_reason,
            session_id=session_id,
            suggestions=suggestions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Medical chat error: {str(e)}")

@router.post("/medical-feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """
    Endpoint for users to provide feedback on AI responses
    This implements the Human + AI validation system
    """
    try:
        # Store feedback (in production, save to database)
        feedback_data = {
            "session_id": feedback.session_id,
            "message_id": feedback.message_id,
            "is_correct": feedback.is_correct,
            "feedback_text": feedback.feedback_text,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # In production: Save to MongoDB for AI improvement
        # db.feedback.insert_one(feedback_data)
        
        return {
            "status": "success",
            "message": "Thank you for your feedback! This helps improve our AI accuracy."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback submission error: {str(e)}")

@router.get("/chat-history/{session_id}")
async def get_chat_history(session_id: str):
    """
    Retrieve chat history for a session
    """
    if session_id not in chat_sessions:
        return {"history": []}
    
    return {"history": chat_sessions[session_id]}

def calculate_confidence(response: str, query: str) -> float:
    """
    Calculate confidence score based on response analysis
    Uses keyword detection and response structure
    """
    confidence = 75.0  # Base confidence
    
    # Increase confidence for specific medical terms
    specific_terms = ["diagnosis", "treatment", "medication", "symptom", "condition"]
    for term in specific_terms:
        if term.lower() in response.lower():
            confidence += 2
    
    # Decrease confidence for uncertainty indicators
    uncertain_terms = ["might", "possibly", "could be", "uncertain", "not sure"]
    for term in uncertain_terms:
        if term.lower() in response.lower():
            confidence -= 5
    
    # Cap confidence between 0-100
    return max(0, min(100, confidence))

def check_doctor_recommendation(query: str, response: str) -> bool:
    """
    Determine if doctor visit should be recommended
    """
    # Emergency keywords
    emergency_keywords = [
        "chest pain", "severe pain", "bleeding", "unconscious",
        "difficulty breathing", "severe headache", "stroke", 
        "heart attack", "emergency", "severe"
    ]
    
    for keyword in emergency_keywords:
        if keyword.lower() in query.lower():
            return True
    
    # Check response for doctor recommendations
    doctor_triggers = ["see a doctor", "consult", "medical professional", "healthcare provider"]
    for trigger in doctor_triggers:
        if trigger.lower() in response.lower():
            return True
    
    return False

def generate_suggestions(query: str, response: str) -> List[str]:
    """
    Generate actionable suggestions based on query and response
    """
    suggestions = []
    
    # Common suggestions based on symptom patterns
    if "headache" in query.lower():
        suggestions = [
            "Stay hydrated - drink plenty of water",
            "Rest in a quiet, dark room",
            "Track when headaches occur to identify triggers"
        ]
    elif "fever" in query.lower():
        suggestions = [
            "Monitor your temperature regularly",
            "Stay hydrated and get plenty of rest",
            "Take over-the-counter fever reducers if needed"
        ]
    elif "cough" in query.lower() or "cold" in query.lower():
        suggestions = [
            "Drink warm fluids and honey tea",
            "Use a humidifier to ease breathing",
            "Get adequate rest to help recovery"
        ]
    else:
        # Default suggestions
        suggestions = [
            "Monitor your symptoms over the next 24-48 hours",
            "Keep a symptom diary to track changes",
            "Maintain good hydration and rest"
        ]
    
    return suggestions[:3]  # Return max 3 suggestions
