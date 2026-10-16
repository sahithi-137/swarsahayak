from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from backend.app.schemas import (
    HealthResponse,
    LanguageInfo,
    AskRequest,
    AskResponse,
    SynthesizeRequest,
    SynthesizeResponse,
    TranscribeRequest,
    TranscribeResponse
)
from backend.app.language_service import language_service
from backend.app.assistant import assistant_engine
from backend.app.speech.service import speech_manager

router = APIRouter(prefix="/api", tags=["SwarSahayak API"])

@router.get("/health", response_model=HealthResponse)
async def get_health():
    """Application health check endpoint."""
    return HealthResponse(
        status="healthy",
        service="SwarSahayak Backend API",
        version="1.0.0",
        languages_loaded=len(language_service.get_all()),
        knowledge_items=assistant_engine.total_items()
    )

@router.get("/languages", response_model=List[LanguageInfo])
async def get_languages():
    """Returns all 17 supported languages along with their capability matrix and tribal/regional documentation."""
    return language_service.get_all()

@router.get("/categories")
async def get_categories():
    """Returns the 4 core service categories with descriptions and icon metadata."""
    return [
        {
            "id": "government_schemes",
            "name": "Government Schemes",
            "nativeNames": {
                "hi": "सरकारी योजनाएं",
                "en": "Government Schemes",
                "te": "ప్రభుత్వ పథకాలు",
                "or": "ସରକାରୀ ଯୋଜନା",
                "bn": "সরকারি প্রকল্প",
                "ta": "அரசு திட்டங்கள்",
                "mr": "सरकारी योजना",
                "gu": "સરકારી યોજનાઓ",
                "kn": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
                "ml": "സർക്കാർ പദ്ധതികൾ",
                "pa": "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ",
                "as": "চৰকাৰী আঁচনি",
                "bho": "सरकारी योजना",
                "sat": "ᱥᱚᱨᱠᱟᱨᱤ ᱡᱚᱡᱚᱱᱟ",
                "unr": "सरकारी योजना",
                "hoc": "सरकारी योजना",
                "kxu": "ସରକାରୀ ଯୋଜନା"
            },
            "description": "PM-KISAN, PM Awas Yojana, TRIFED Van Dhan, and welfare benefits.",
            "icon": "landmark"
        },
        {
            "id": "healthcare",
            "name": "Healthcare",
            "nativeNames": {
                "hi": "स्वास्थ्य सेवाएं",
                "en": "Healthcare",
                "te": "ఆరోగ్య సేవలు",
                "or": "ସ୍ୱାସ୍ଥ୍ୟ ସେବା",
                "bn": "স্বাস্থ্য পরিষেবা",
                "ta": "சுகாதார சேவைகள்",
                "mr": "आरोग्य सेवा",
                "gu": "આરોગ્ય સેવાઓ",
                "kn": "ಆರೋಗ್ಯ ಸೇವೆಗಳು",
                "ml": "ആരോഗ്യ സേവനങ്ങൾ",
                "pa": "ਸਿਹਤ ਸੇਵਾਵਾਂ",
                "as": "স্বাস্থ্য সেৱা",
                "bho": "दवाई-इलाज (स्वास्थ्य)",
                "sat": "ᱦᱚᱲᱢᱚ-ᱥᱟᱶᱟᱨ",
                "unr": "स्वास्थ्य सेवा",
                "hoc": "स्वास्थ्य सेवा",
                "kxu": "ସ୍ୱାସ୍ଥ୍ୟ ସେବା"
            },
            "description": "Ayushman Bharat, 108 Emergency Ambulance, and preventive health guidance.",
            "icon": "heart-pulse"
        },
        {
            "id": "education",
            "name": "Education",
            "nativeNames": {
                "hi": "शिक्षा व छात्रवृत्ति",
                "en": "Education",
                "te": "విద్య & స్కాలర్‌షిప్‌లు",
                "or": "ଶିକ୍ଷା ଓ ବୃତ୍ତି",
                "bn": "শিক্ষা ও বৃত্তি",
                "ta": "கல்வி மற்றும் உதவித்தொகை",
                "mr": "शिक्षण व शिष्यवृत्ती",
                "gu": "શિક્ષણ અને શિષ્યવૃત્તિ",
                "kn": "ಶಿಕ್ಷಣ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿವೇತನ",
                "ml": "വിദ്യാഭ്യാസവും സ്കോളർഷಿപ്പും",
                "pa": "ਸਿੱਖਿਆ ਅਤੇ ਵਜ਼ੀਫ਼ਾ",
                "as": "শিক্ষা আৰু জলপানি",
                "bho": "पढ़ाई आ छात्रवृत्ति",
                "sat": "ᱥᱮᱪᱮᱫ ᱟᱨ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ",
                "unr": "शिक्षा आर छात्रवृत्ति",
                "hoc": "शिक्षा आर छात्रवृत्ति",
                "kxu": "ଶିକ୍ଷା ଓ ସ୍କଲାରସିପ୍"
            },
            "description": "Tribal scholarships, Eklavya Schools (EMRS), and free DIKSHA textbooks.",
            "icon": "book-open"
        },
        {
            "id": "safe_banking",
            "name": "Safe Banking",
            "nativeNames": {
                "hi": "सुरक्षित बैंकिंग",
                "en": "Safe Banking",
                "te": "సురକ୍ଷిత బ్యాంకింగ్",
                "or": "ସୁରକ୍ଷିତ ବ୍ୟାଙ୍କିଙ୍ଗ୍",
                "bn": "নিরাপদ ব্যাঙ্কিং",
                "ta": "பாதுகாப்பான வங்கி",
                "mr": "सुरक्षित बँकिंग",
                "gu": "સુરક્ષિત બેંકિંગ",
                "kn": "ಸುರಕ್ಷಿತ ಬ್ಯಾಂಕಿಂಗ್",
                "ml": "സുರക്ഷിത ബാങ്കിംഗ്",
                "pa": "ਸੁਰੱਖਿਅਤ ਬੈਂਕਿੰਗ",
                "as": "সুৰক্ষিত বেংকিং",
                "bho": "सुरक्षित बैंकिंग",
                "sat": "ᱥᱩᱨᱚᱠᱷᱭᱟᱹ ᱵᱮᱝᱠᱤᱝ",
                "unr": "सुरक्षित बैंकिंग",
                "hoc": "सुरक्षित बैंकिंग",
                "kxu": "ସୁରକ୍ଷିତ ବ୍ୟାଙ୍କିଙ୍ଗ୍"
            },
            "description": "UPI fraud prevention, OTP secrecy, AEPS biometric safety, and 1930 helpline.",
            "icon": "shield-check"
        }
    ]

@router.get("/knowledge")
async def list_knowledge(category: Optional[str] = None):
    """Returns curated knowledge items filtered by category."""
    items = assistant_engine.knowledge_items
    if category and category.lower() != "all":
        items = [i for i in items if i.get("category") == category.lower()]
    return [
        {
            "id": i["id"],
            "category": i["category"],
            "title": i["title"],
            "verified_source": i["verified_source"],
            "verified_url": i["verified_url"],
            "verification_date": i["verification_date"],
            "languages_available": list(i.get("answers", {}).keys())
        }
        for i in items
    ]

@router.post("/ask", response_model=AskResponse)
async def ask_assistant(req: AskRequest):
    """Processes user query and returns localized factual answer with sources."""
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    return await assistant_engine.answer_question(req)

@router.post("/speech/synthesize", response_model=SynthesizeResponse)
async def synthesize_speech(req: SynthesizeRequest):
    """Synthesizes text to speech using configured provider or returns honest limitation."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    success, audio_b64, provider, msg, metadata = await speech_manager.synthesize(
        text=req.text,
        lang_code=req.language,
        answer_id=getattr(req, "answer_id", None)
    )
    return SynthesizeResponse(
        success=success,
        audio_base64=audio_b64,
        format="mp3",
        mime_type="audio/mpeg",
        provider=provider,
        message=msg
    )

@router.get("/speech/test-voice/{lang_code}")
async def get_test_voice(lang_code: str):
    """Returns sample voice audio for testing speech output in any language."""
    code = lang_code.lower().strip()
    success, audio_b64, provider, sample_text, msg = await speech_manager.get_test_voice(code)
    return {
        "success": success,
        "language": code,
        "audio_base64": audio_b64,
        "provider": provider,
        "sample_text": sample_text,
        "message": msg
    }

@router.get("/recordings")
async def list_recordings(
    language: Optional[str] = Query(None, description="Filter by language code"),
    answer_id: Optional[str] = Query(None, description="Filter by answer ID")
):
    """Returns list of verified native-speaker human audio recordings."""
    from backend.app.speech.recorded_audio_service import recorded_audio_service
    return recorded_audio_service.list_recordings(lang_code=language, answer_id=answer_id)

@router.post("/speech/transcribe", response_model=TranscribeResponse)
async def transcribe_speech(req: TranscribeRequest):
    """Speech-to-text adapter for incoming audio bytes."""
    lang_info = language_service.get_by_code(req.language)
    if not lang_info or not lang_info.capabilities.speechRecognition:
        return TranscribeResponse(
            success=False,
            text="",
            language=req.language,
            confidence=0.0,
            provider="fallback_advisory",
            message=f"Speech recognition is not natively supported for {req.language}. Please type your question manually."
        )

    return TranscribeResponse(
        success=True,
        text="",
        language=req.language,
        confidence=1.0,
        provider="browser_web_speech_or_backend_relay",
        message="Client-side Web Speech API active."
    )

