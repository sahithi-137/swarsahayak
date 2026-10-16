import base64
from typing import Tuple, Optional, Dict, Any
from backend.app.speech.base import BaseSpeechProvider
from backend.app.speech.gtts_adapter import GTTSProvider
from backend.app.speech.bhashini_adapter import BhashiniProvider

import base64
from typing import Tuple, Optional, Dict, Any
from backend.app.speech.tts_service import tts_service
from backend.app.speech.asr_service import asr_service
from backend.app.speech.provider_factory import speech_factory

class SpeechManager:
    """
    Unified Speech Service Manager.
    Delegates to TTSService and ASRService with provider abstractions.
    """

    def get_supported_tts_languages(self) -> Dict[str, str]:
        # Return dict of supported languages and their provider
        langs = {}
        for code, voice in speech_factory.edge_tts.VOICE_MAP.items():
            langs[code] = f"Edge Neural ({voice})"
        for code in speech_factory.gtts.SUPPORTED_TTS_LANGUAGES:
            if code not in langs:
                langs[code] = "gTTS (Server)"
        return langs

    async def synthesize(
        self,
        text: str,
        lang_code: str,
        answer_id: Optional[str] = None
    ) -> Tuple[bool, Optional[str], str, str, Dict[str, Any]]:
        return await tts_service.synthesize(text, lang_code, answer_id)

    async def get_test_voice(self, lang_code: str) -> Tuple[bool, Optional[str], str, str, str]:
        return await tts_service.get_test_voice_audio(lang_code)

    async def transcribe(self, audio_bytes: bytes, lang_code: str) -> Tuple[bool, str, float, str, str]:
        return await asr_service.transcribe(audio_bytes, lang_code)

speech_manager = SpeechManager()

