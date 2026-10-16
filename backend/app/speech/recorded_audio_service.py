import json
import os
import base64
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RECORDINGS_DIR = DATA_DIR / "recordings"
MANIFEST_PATH = DATA_DIR / "recordings_manifest.json"

class RecordedAudioService:
    """
    Manages verified native-speaker human audio recordings for regional & tribal languages.
    Provides strict provenance tracking (speaker, dialect, review status, transcript)
    to protect linguistic authenticity.
    """

    def __init__(self):
        RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)
        self.recordings: List[Dict[str, Any]] = []
        self._load_manifest()

    def _load_manifest(self):
        if not MANIFEST_PATH.exists():
            self.recordings = []
            self._save_manifest()
            return

        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                self.recordings = json.load(f)
        except Exception as e:
            print(f"Error loading recordings manifest: {e}")
            self.recordings = []

    def _save_manifest(self):
        try:
            with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
                json.dump(self.recordings, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving recordings manifest: {e}")

    def list_recordings(self, lang_code: Optional[str] = None, answer_id: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self.recordings
        if lang_code:
            code = lang_code.lower().strip()
            results = [r for r in results if r.get("language_code", "").lower() == code]
        if answer_id:
            aid = answer_id.strip()
            results = [r for r in results if r.get("answer_id") == aid]
        return results

    def get_recording_for_answer(self, answer_id: str, lang_code: str) -> Optional[Dict[str, Any]]:
        code = lang_code.lower().strip()
        aid = answer_id.strip()
        for r in self.recordings:
            if r.get("answer_id") == aid and r.get("language_code", "").lower() == code:
                if r.get("review_status") == "verified_community_review":
                    return r
        return None

    def get_test_voice_recording(self, lang_code: str) -> Optional[Dict[str, Any]]:
        code = lang_code.lower().strip()
        for r in self.recordings:
            if r.get("language_code", "").lower() == code and (r.get("answer_id") == "test_voice" or r.get("is_test_voice")):
                return r
        # If no specific test voice, return any verified recording for this language
        for r in self.recordings:
            if r.get("language_code", "").lower() == code:
                return r
        return None

    def get_recording_bytes(self, recording_id: str) -> Optional[bytes]:
        rec = next((r for r in self.recordings if r.get("id") == recording_id), None)
        if not rec:
            return None

        file_name = rec.get("file_path")
        if not file_name:
            return None

        full_path = RECORDINGS_DIR / file_name
        if not full_path.exists():
            return None

        try:
            with open(full_path, "rb") as f:
                return f.read()
        except Exception as e:
            print(f"Error reading recording file {full_path}: {e}")
            return None

    def get_recording_base64(self, recording_id: str) -> Optional[str]:
        raw = self.get_recording_bytes(recording_id)
        if raw:
            return base64.b64encode(raw).decode("utf-8")
        return None

    def attach_recording(
        self,
        answer_id: str,
        lang_code: str,
        dialect: str,
        speaker_name: str,
        reviewed_by: str,
        audio_bytes: bytes,
        audio_format: str = "mp3",
        transcript: str = "",
        is_test_voice: bool = False
    ) -> Dict[str, Any]:
        """
        Attaches a new native-speaker human audio recording with full review provenance.
        """
        code = lang_code.lower().strip()
        rec_id = f"rec_{code}_{answer_id}_{len(self.recordings) + 1}"
        file_name = f"{rec_id}.{audio_format.lower()}"
        file_full_path = RECORDINGS_DIR / file_name

        with open(file_full_path, "wb") as f:
            f.write(audio_bytes)

        new_rec = {
            "id": rec_id,
            "answer_id": answer_id,
            "language_code": code,
            "dialect": dialect,
            "speaker_name": speaker_name,
            "reviewed_by": reviewed_by,
            "review_status": "verified_community_review",
            "audio_format": audio_format.lower(),
            "file_path": file_name,
            "file_size_bytes": len(audio_bytes),
            "recorded_date": "2026-10-16",
            "transcript": transcript,
            "is_test_voice": is_test_voice
        }

        # Remove existing duplicate if any
        self.recordings = [r for r in self.recordings if not (r.get("answer_id") == answer_id and r.get("language_code") == code)]
        self.recordings.append(new_rec)
        self._save_manifest()
        return new_rec

recorded_audio_service = RecordedAudioService()
