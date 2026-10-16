from typing import Tuple, Optional, Dict, Any
from backend.app.speech.provider_factory import speech_factory

class ASRService:
    """
    Core Automatic Speech Recognition (ASR / STT) service.
    Coordinates audio-to-text transcription requests.
    """

    async def transcribe(
        self,
        audio_bytes: bytes,
        lang_code: str
    ) -> Tuple[bool, str, float, str, str]:
        """
        Transcribes audio to text.
        Returns: (success, text, confidence, provider, message)
        """
        code = lang_code.lower().strip()
        provider = speech_factory.get_asr_provider(code)

        if provider:
            success, text, msg = await provider.transcribe(audio_bytes, code)
            return success, text, 0.9 if success else 0.0, provider.name(), msg

        return (
            False,
            "",
            0.0,
            "browser_web_speech_or_manual_input",
            f"Server-side ASR for '{code}' is routed to client-side browser Web Speech API or manual text input."
        )

asr_service = ASRService()
