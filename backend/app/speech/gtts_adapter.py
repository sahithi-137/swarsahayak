import io
from typing import Optional, Tuple
from gtts import gTTS
from backend.app.speech.base import BaseSpeechProvider

class GTTSProvider(BaseSpeechProvider):
    """
    Standard free text-to-speech fallback provider using Google TTS.
    Strictly restricted to languages where pronunciation is verified.
    Does NOT falsely pronounce tribal or unverified languages.
    """

    # Supported language codes in gTTS
    SUPPORTED_TTS_LANGUAGES = {
        "hi": "hi",
        "en": "en",
        "bn": "bn",
        "te": "te",
        "ta": "ta",
        "mr": "mr",
        "gu": "gu",
        "kn": "kn",
        "ml": "ml",
        "pa": "pa",
        "ur": "ur",
        "ne": "ne"
    }

    def name(self) -> str:
        return "gTTS (Server-Side TTS)"

    def supports_tts(self, lang_code: str) -> bool:
        return lang_code.lower() in self.SUPPORTED_TTS_LANGUAGES

    def supports_stt(self, lang_code: str) -> bool:
        return False

    async def synthesize(self, text: str, lang_code: str) -> Tuple[bool, Optional[bytes], str]:
        code = lang_code.lower()
        if not self.supports_tts(code):
            return (
                False,
                None,
                f"Audio speech synthesis is not natively supported for language '{lang_code}'. "
                f"To maintain linguistic integrity, fallback to another language's voice is disabled."
            )

        try:
            gtts_code = self.SUPPORTED_TTS_LANGUAGES[code]
            # Use gTTS to synthesize audio into memory buffer
            # Clean text if too long (keep first 600 characters for snappy response)
            clean_text = text.strip()
            if len(clean_text) > 800:
                clean_text = clean_text[:800] + "..."

            tts = gTTS(text=clean_text, lang=gtts_code, slow=False)
            fp = io.BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            audio_bytes = fp.read()
            return True, audio_bytes, "Speech synthesis succeeded via server TTS."
        except Exception as e:
            return False, None, f"Server speech synthesis error: {str(e)}"

    async def transcribe(self, audio_bytes: bytes, lang_code: str) -> Tuple[bool, str, str]:
        return False, "", "gTTS does not provide speech recognition."
