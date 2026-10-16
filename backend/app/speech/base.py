from abc import ABC, abstractmethod
from typing import Optional, Tuple

class BaseSpeechProvider(ABC):
    @abstractmethod
    def name(self) -> str:
        """Returns the provider name."""
        pass

    @abstractmethod
    def supports_tts(self, lang_code: str) -> bool:
        """Checks if text-to-speech is genuinely supported for this language code."""
        pass

    @abstractmethod
    def supports_stt(self, lang_code: str) -> bool:
        """Checks if speech-to-text is genuinely supported for this language code."""
        pass

    @abstractmethod
    async def synthesize(self, text: str, lang_code: str) -> Tuple[bool, Optional[bytes], str]:
        """
        Synthesizes text to speech.
        Returns: (success, audio_bytes, message)
        """
        pass

    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, lang_code: str) -> Tuple[bool, str, str]:
        """
        Transcribes speech audio to text.
        Returns: (success, transcript_text, message)
        """
        pass
