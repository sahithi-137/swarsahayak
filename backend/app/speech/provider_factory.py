from typing import Optional, Dict, Any, List
from backend.app.speech.base import BaseSpeechProvider
from backend.app.speech.edge_tts_adapter import EdgeTTSProvider
from backend.app.speech.gtts_adapter import GTTSProvider
from backend.app.speech.bhashini_adapter import BhashiniProvider
from backend.app.speech.recorded_audio_service import recorded_audio_service

class SpeechProviderFactory:
    """
    Factory and registry for speech synthesis (TTS) and speech recognition (ASR) providers.
    Enforces truthful routing, prioritized fallbacks, and authentic native audio pipelines.
    """

    def __init__(self):
        self.edge_tts = EdgeTTSProvider()
        self.gtts = GTTSProvider()
        self.bhashini = BhashiniProvider()

    def get_tts_provider(self, lang_code: str) -> Optional[BaseSpeechProvider]:
        code = lang_code.lower().strip()

        # 1. Edge TTS has highest neural audio quality for supported Indian languages
        if self.edge_tts.supports_tts(code):
            return self.edge_tts

        # 2. Bhashini if configured in production
        if self.bhashini.is_configured() and self.bhashini.supports_tts(code):
            return self.bhashini

        # 3. Server gTTS fallback
        if self.gtts.supports_tts(code):
            return self.gtts

        return None

    def get_asr_provider(self, lang_code: str) -> Optional[BaseSpeechProvider]:
        code = lang_code.lower().strip()
        if self.bhashini.is_configured() and self.bhashini.supports_stt(code):
            return self.bhashini
        return None

    def has_recorded_audio(self, answer_id: str, lang_code: str) -> bool:
        return recorded_audio_service.get_recording_for_answer(answer_id, lang_code) is not None

    def has_test_voice_recording(self, lang_code: str) -> bool:
        return recorded_audio_service.get_test_voice_recording(lang_code) is not None

    def get_language_speech_status(self, lang_code: str) -> Dict[str, Any]:
        code = lang_code.lower().strip()

        # Check if neural or server TTS exists
        tts_prov = self.get_tts_provider(code)
        if tts_prov:
            return {
                "tts_available": True,
                "tts_provider": tts_prov.name(),
                "speech_status": "voice_available",
                "label": "Voice Available"
            }

        # Check if native-speaker recordings exist
        recordings = recorded_audio_service.list_recordings(code)
        if recordings:
            return {
                "tts_available": True,
                "tts_provider": "Verified Native Speaker Recording",
                "speech_status": "recorded_answers_available",
                "label": "Recorded Answers Available",
                "recordings_count": len(recordings)
            }

        # Speech in pilot / research
        return {
            "tts_available": False,
            "tts_provider": "None (Bhashini/AI4Bharat Pilot in Progress)",
            "speech_status": "voice_setup_in_progress",
            "label": "Voice Setup in Progress"
        }

speech_factory = SpeechProviderFactory()
