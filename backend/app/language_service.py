import json
import os
from pathlib import Path
from typing import List, Optional, Dict, Any
from backend.app.schemas import LanguageInfo, LanguageCapabilities

DATA_DIR = Path(__file__).resolve().parent / "data"

class LanguageService:
    def __init__(self):
        self._languages: Dict[str, LanguageInfo] = {}
        self._load_languages()

    def _load_languages(self):
        file_path = DATA_DIR / "languages.json"
        if not file_path.exists():
            raise FileNotFoundError(f"Language configuration file missing at {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for item in data:
            caps_dict = item.get("capabilities", {})
            caps = LanguageCapabilities(
                uiTranslation=caps_dict.get("uiTranslation", True),
                textInput=caps_dict.get("textInput", True),
                speechRecognition=caps_dict.get("speechRecognition", False),
                speechSynthesis=caps_dict.get("speechSynthesis", False),
                answerTranslation=caps_dict.get("answerTranslation", True),
                translation=caps_dict.get("translation", True),
                answerContent=caps_dict.get("answerContent", True)
            )
            info = LanguageInfo(
                id=item.get("id", item["code"]),
                code=item["code"],
                name=item["name"],
                nativeName=item["nativeName"],
                region=item.get("region", "north"),
                script=item["script"],
                locale=item["locale"],
                tier=item.get("tier", "standard"),
                capabilities=caps,
                asrProvider=item.get("asrProvider", "browser_web_speech"),
                ttsProvider=item.get("ttsProvider", "edge_neural_tts"),
                translationProvider=item.get("translationProvider", "verified_expert_corpus"),
                voiceProvider=item.get("voiceProvider", item.get("ttsProvider", "browser_and_server")),
                speechStatus=item.get("speechStatus", "voice_available"),
                recordedAudioAvailable=item.get("recordedAudioAvailable", False),
                verificationStatus=item.get("verificationStatus", "verified"),
                statusLabel=item.get("statusLabel", "Supported"),
                notes=item.get("notes", "")
            )
            self._languages[info.code.lower()] = info

    def get_all(self) -> List[LanguageInfo]:
        return list(self._languages.values())

    def get_by_code(self, code: str) -> Optional[LanguageInfo]:
        return self._languages.get(code.lower().strip())

    def exists(self, code: str) -> bool:
        return code.lower().strip() in self._languages

language_service = LanguageService()
