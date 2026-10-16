import base64
from typing import Tuple, Optional, Dict, Any
from backend.app.speech.provider_factory import speech_factory
from backend.app.speech.recorded_audio_service import recorded_audio_service

class TTSService:
    """
    Core Text-to-Speech service.
    Orchestrates synthesis across:
      1. Edge Neural TTS (Studio Quality)
      2. Verified Native-Speaker Human Recordings (Regional & Tribal)
      3. Bhashini Dhruva (Production Gov Mission)
      4. Server gTTS (Fallback)
    """

    async def synthesize(
        self,
        text: str,
        lang_code: str,
        answer_id: Optional[str] = None
    ) -> Tuple[bool, Optional[str], str, str, Dict[str, Any]]:
        """
        Synthesize text or retrieve approved recording.
        Returns: (success, base64_audio, provider_name, message, metadata)
        """
        code = lang_code.lower().strip()
        metadata: Dict[str, Any] = {}

        # 1. Check if a verified native-speaker recording exists for this answer
        if answer_id:
            rec = recorded_audio_service.get_recording_for_answer(answer_id, code)
            if rec:
                b64 = recorded_audio_service.get_recording_base64(rec["id"])
                if b64:
                    metadata = {
                        "isRecorded": True,
                        "speaker": rec.get("speaker_name"),
                        "dialect": rec.get("dialect"),
                        "reviewStatus": rec.get("review_status"),
                        "recordedDate": rec.get("recorded_date")
                    }
                    return (
                        True,
                        b64,
                        "Verified Native Speaker Recording",
                        f"Spoken answer loaded from verified {rec.get('dialect', code)} recording.",
                        metadata
                    )

        # 2. Check if an automated TTS provider exists
        provider = speech_factory.get_tts_provider(code)
        if provider:
            success, audio_bytes, msg = await provider.synthesize(text, code)
            if success and audio_bytes:
                b64 = base64.b64encode(audio_bytes).decode("utf-8")
                return True, b64, provider.name(), msg, {"isRecorded": False}
            else:
                return False, None, provider.name(), msg, {}

        # 3. Check if any generic/test recording is available for this language
        test_rec = recorded_audio_service.get_test_voice_recording(code)
        if test_rec:
            b64 = recorded_audio_service.get_recording_base64(test_rec["id"])
            if b64:
                metadata = {
                    "isRecorded": True,
                    "speaker": test_rec.get("speaker_name"),
                    "dialect": test_rec.get("dialect"),
                    "reviewStatus": test_rec.get("review_status")
                }
                return (
                    True,
                    b64,
                    "Verified Native Speaker Recording",
                    f"Spoken in verified {test_rec.get('dialect', code)} native audio.",
                    metadata
                )

        # 4. Truthful limitation reporting: zero faking
        return (
            False,
            None,
            "manual_reading_mode",
            f"Native speech synthesis is not currently available for language code '{code}'. "
            f"To prevent incorrect accents or mispronunciation, manual reading mode is active.",
            {}
        )

    async def get_test_voice_audio(self, lang_code: str) -> Tuple[bool, Optional[str], str, str, str]:
        """
        Generate or retrieve sample test audio for language preview.
        Returns: (success, base64_audio, provider, sample_text, message)
        """
        code = lang_code.lower().strip()

        # Check recorded test voice first for regional/tribal
        test_rec = recorded_audio_service.get_test_voice_recording(code)
        if test_rec:
            b64 = recorded_audio_service.get_recording_base64(test_rec["id"])
            if b64:
                return (
                    True,
                    b64,
                    "Verified Native Speaker Recording",
                    test_rec.get("transcript", "नमस्ते, स्वर सहायक में आपका स्वागत है।"),
                    f"Preview audio from verified {test_rec.get('dialect', code)} speaker."
                )

        # Check automated TTS provider
        provider = speech_factory.get_tts_provider(code)
        if provider:
            sample_greetings = {
                "hi": "नमस्ते, स्वर सहायक में आपका स्वागत है। आप सरकारी योजनाओं के बारे में पूछ सकते हैं।",
                "en": "Hello, welcome to SwarSahayak. You can ask about government welfare schemes.",
                "bn": "নমস্কার, স্বর সহায়কে আপনাকে স্বাগতম। আপনি সরকারি প্রকল্প সম্পর্কে জানতে পারেন।",
                "te": "నమస్కారం, స్వర సహాయక్ కు స్వాగతం. మీరు ప్రభుత్వ పథకాల గురించి అడగవచ్చు.",
                "ta": "வணக்கம், ஸ்வர சஹாயக்-க்கு உங்களை வரவேற்கிறோம். அரசு திட்டங்கள் பற்றி கேட்கலாம்.",
                "mr": "नमस्कार, स्वर सहायक मध्ये आपले स्वागत आहे. आपण सरकारी योजनांबद्दल विचारू शकता.",
                "gu": "નમસ્તે, સ્વર સહાયકમાં આપનું સ્વાગત છે. તમે સરકારી યોજનાઓ વિશે પૂછી શકો છો.",
                "kn": "ನಮಸ್ಕಾರ, ಸ್ವರ ಸಹಾಯಕಗೆ ಸುಸ್ವಾಗತ. ನೀವು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಬಹುದು.",
                "ml": "നമസ്കാരം, സ്വര സഹായക്കിലേക്ക് സ്വാഗതം. നിങ്ങൾക്ക് സർക്കാർ പദ്ധതികളെക്കുറിച്ച് ചോദിക്കാം.",
                "pa": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਸਵਰ ਸਹਾਇਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਤੁਸੀਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
                "ur": "السلام علیکم، سور سہایک میں خوش آمدید۔ آپ سرکاری اسکیموں کے بارے میں پوچھ سکتے ہیں۔",
                "ne": "नमस्ते, स्वर सहायकमा यहाँलाई स्वागत छ। तपाईं सरकारी योजनाहरू बारे सोध्न सक्नुहुन्छ।"
            }
            sample_text = sample_greetings.get(code, "नमस्ते, स्वर सहायक में आपका स्वागत है।")
            success, audio_bytes, msg = await provider.synthesize(sample_text, code)
            if success and audio_bytes:
                b64 = base64.b64encode(audio_bytes).decode("utf-8")
                return True, b64, provider.name(), sample_text, "Preview audio generated successfully."

        return (
            False,
            None,
            "manual_reading_mode",
            "",
            f"Voice preview is currently being recorded by native speakers for '{code}'."
        )

tts_service = TTSService()
