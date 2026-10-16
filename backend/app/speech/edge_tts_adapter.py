import asyncio
import edge_tts
from typing import Optional, Tuple, Dict
from backend.app.speech.base import BaseSpeechProvider

class EdgeTTSProvider(BaseSpeechProvider):
    """
    High-fidelity Neural Text-To-Speech adapter using Microsoft Edge Neural Voices.
    Free, production-grade speech synthesis with zero required API keys.
    Provides natural intonation, authentic Indian accent profiles, and crisp audio.
    """

    VOICE_MAP: Dict[str, str] = {
        "hi": "hi-IN-SwaraNeural",
        "en": "en-IN-NeerjaNeural",
        "bn": "bn-IN-TanishaaNeural",
        "te": "te-IN-ShrutiNeural",
        "ta": "ta-IN-PallaviNeural",
        "mr": "mr-IN-AarohiNeural",
        "gu": "gu-IN-DhwaniNeural",
        "kn": "kn-IN-SapnaNeural",
        "ml": "ml-IN-SobhanaNeural",
        "ur": "ur-IN-GulNeural",
        "ne": "ne-NP-HemkalaNeural"
    }

    def name(self) -> str:
        return "Microsoft Edge Neural TTS (Studio Quality)"

    def supports_tts(self, lang_code: str) -> bool:
        return lang_code.lower().strip() in self.VOICE_MAP

    def supports_stt(self, lang_code: str) -> bool:
        return False

    async def synthesize(self, text: str, lang_code: str) -> Tuple[bool, Optional[bytes], str]:
        code = lang_code.lower().strip()
        voice = self.VOICE_MAP.get(code)
        if not voice:
            return False, None, f"Edge TTS does not provide a native neural voice for '{code}'."

        clean_text = text.strip()
        if len(clean_text) > 1000:
            clean_text = clean_text[:1000] + "..."

        try:
            communicate = edge_tts.Communicate(clean_text, voice)
            audio_chunks = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_chunks.append(chunk["data"])

            if not audio_chunks:
                return False, None, "Edge TTS stream returned empty audio."

            audio_bytes = b"".join(audio_chunks)
            return True, audio_bytes, f"Speech synthesis successful via {voice}."
        except Exception as e:
            return False, None, f"Edge TTS synthesis error: {str(e)}"

    async def transcribe(self, audio_bytes: bytes, lang_code: str) -> Tuple[bool, str, str]:
        return False, "", "Edge TTS is a speech synthesis engine only."
