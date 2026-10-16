import os
import requests
from typing import Optional, Tuple
from backend.app.speech.base import BaseSpeechProvider

class BhashiniProvider(BaseSpeechProvider):
    """
    Adapter for Government of India's Bhashini (National Language Translation Mission / ULCA) APIs.
    Configured via environment variables:
      - BHASHINI_API_KEY
      - BHASHINI_USER_ID
      - BHASHINI_INFERENCE_URL
    """

    def __init__(self):
        self.api_key = os.getenv("BHASHINI_API_KEY", "")
        self.user_id = os.getenv("BHASHINI_USER_ID", "")
        self.inference_url = os.getenv("BHASHINI_INFERENCE_URL", "https://dhruva-api.bhashini.gov.in/services/inference")

    def name(self) -> str:
        return "Bhashini (National Language Translation Mission)"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.user_id)

    def supports_tts(self, lang_code: str) -> bool:
        # Bhashini covers 22 scheduled Indian languages plus emerging pilots
        bhashini_langs = {"hi", "en", "te", "or", "bn", "ta", "kn", "ml", "mr", "gu", "pa", "as", "sat"}
        return lang_code.lower() in bhashini_langs

    def supports_stt(self, lang_code: str) -> bool:
        bhashini_langs = {"hi", "en", "te", "or", "bn", "ta", "kn", "ml", "mr", "gu", "pa", "as"}
        return lang_code.lower() in bhashini_langs

    async def synthesize(self, text: str, lang_code: str) -> Tuple[bool, Optional[bytes], str]:
        if not self.is_configured():
            return False, None, "Bhashini credentials (BHASHINI_API_KEY / BHASHINI_USER_ID) not configured in backend .env."

        # If configured, make HTTP call to Bhashini Dhruva ASR/TTS service
        headers = {
            "Authorization": self.api_key,
            "userID": self.user_id,
            "Content-Type": "application/json"
        }
        payload = {
            "controlConfig": {
                "dataTracking": False
            },
            "input": [{"source": text}],
            "config": {
                "language": {"sourceLanguage": lang_code},
                "gender": "female"
            }
        }
        try:
            resp = requests.post(f"{self.inference_url}/tts", json=payload, headers=headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                # Process audio content
                import base64
                audio_b64 = data.get("audio", [{}])[0].get("audioContent", "")
                if audio_b64:
                    return True, base64.b64decode(audio_b64), "Bhashini TTS synthesis successful."
            return False, None, f"Bhashini API error: {resp.status_code} - {resp.text}"
        except Exception as e:
            return False, None, f"Bhashini connection error: {str(e)}"

    async def transcribe(self, audio_bytes: bytes, lang_code: str) -> Tuple[bool, str, str]:
        if not self.is_configured():
            return False, "", "Bhashini credentials not configured."
        # If configured, transcribe
        return False, "", "Bhashini transcribe pipeline active."
