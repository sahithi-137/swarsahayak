from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LanguageCapabilities(BaseModel):
    uiTranslation: bool = True
    textInput: bool = True
    speechRecognition: bool = False
    speechSynthesis: bool = False
    answerTranslation: bool = True
    translation: bool = True
    answerContent: bool = True

class LanguageInfo(BaseModel):
    id: Optional[str] = None
    code: str
    name: str
    nativeName: str
    region: str = "north"
    script: str
    locale: str
    tier: Optional[str] = "standard"
    capabilities: LanguageCapabilities
    asrProvider: Optional[str] = "browser_web_speech"
    ttsProvider: Optional[str] = "edge_neural_tts"
    translationProvider: Optional[str] = "verified_expert_corpus"
    voiceProvider: Optional[str] = "browser_and_server"
    speechStatus: str = "voice_available"
    recordedAudioAvailable: bool = False
    verificationStatus: str = "verified"
    statusLabel: str
    notes: str

class SourceReference(BaseModel):
    title: str
    verified_source: str
    verified_url: str
    verification_date: str

class AskRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User's query in native script, transliterated text, or English")
    language: str = Field(default="hi", description="ISO 639-1 language code (e.g., hi, en, te, sat)")
    category: Optional[str] = Field(None, description="Optional category filter (government_schemes, healthcare, education, safe_banking)")

class AskResponse(BaseModel):
    query: str
    answer: str
    answer_language: str
    requested_language: str
    category: str
    matched_topic: Optional[str] = None
    sources: List[SourceReference] = []
    disclaimer: Optional[str] = None
    audio_available: bool = False
    audio_provider: str = "manual_reading_mode"
    audio_base64: Optional[str] = None
    language_notes: Optional[str] = None
    confidence: float = 1.0

class SynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text to synthesize to speech")
    language: str = Field(default="hi", description="Language code")
    rate: Optional[float] = Field(default=1.0, description="Speech rate multiplier")

class SynthesizeResponse(BaseModel):
    success: bool
    audio_base64: Optional[str] = None
    format: str = "mp3"
    mime_type: str = "audio/mpeg"
    provider: str
    message: str

class TranscribeRequest(BaseModel):
    audio_base64: Optional[str] = Field(None, description="Base64-encoded audio chunk")
    language: str = Field(default="hi", description="Target language code or locale")

class TranscribeResponse(BaseModel):
    success: bool
    text: str
    language: str
    confidence: float
    provider: str
    message: str

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    languages_loaded: int
    knowledge_items: int
