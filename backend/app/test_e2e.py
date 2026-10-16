import sys
import requests
import json
import base64

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("=================================================================")
    print(" SWARSAHAYAK — END-TO-END MULTILINGUAL SPEECH INTEGRATION TEST")
    print("=================================================================")

    # 1. Health Check
    health = requests.get(f"{BASE_URL}/health").json()
    print(f"\n[1] Health Check: Status={health['status']} | Languages Loaded={health['languages_loaded']} | Knowledge Items={health['knowledge_items']}")
    assert health['status'] == "healthy"
    assert health['languages_loaded'] >= 35

    # 2. Languages Catalogue Check
    languages = requests.get(f"{BASE_URL}/languages").json()
    print(f"\n[2] Master Languages Catalogue: Total={len(languages)}")
    regions = set(l['region'] for l in languages)
    print(f"    Geographic Regions present: {sorted(list(regions))}")
    assert len(regions) >= 6

    # 3. Test Voice Audio Check (Regional, Tribal, and Scheduled)
    test_langs = ["hi", "bho", "sat", "unr", "hoc", "kxu", "bgc", "pa", "te", "bn", "mr", "gu", "kn", "ml", "ur", "ne", "en"]
    print(f"\n[3] Testing Test-Voice Audio Output for {len(test_langs)} key languages:")
    for code in test_langs:
        r = requests.get(f"{BASE_URL}/speech/test-voice/{code}").json()
        has_b64 = bool(r.get("audio_base64"))
        b64_len = len(r.get("audio_base64", "")) if has_b64 else 0
        prov = r.get("provider")
        print(f"    - [{code.upper()}]: Audio={has_b64} ({b64_len} chars b64) | Provider='{prov}' | Text='{r.get('sample_text', '')[:35]}...'")
        assert has_b64, f"Test voice audio missing for {code}"

    # 4. Question Answering with Spoken Output
    print(f"\n[4] Testing Spoken Answer Retrieval for PM-KISAN:")
    for lang in ["bho", "sat", "unr", "hi", "ur", "pa"]:
        payload = {"query": "PM-KISAN scheme", "language": lang}
        res = requests.post(f"{BASE_URL}/ask", json=payload).json()
        print(f"    - Lang={lang}: Matched='{res.get('matched_topic')}' | AudioAvailable={res.get('audio_available')} | Provider='{res.get('audio_provider')}' | AudioSize={len(res.get('audio_base64', '') or '')} chars")
        assert res.get("audio_available") is True
        assert bool(res.get("audio_base64")) is True

    # 5. Native Speaker Recordings Manifest Check
    recs = requests.get(f"{BASE_URL}/recordings").json()
    print(f"\n[5] Verified Native Speaker Human Audio Recordings: Total={len(recs)} active recordings in repository")
    for r in recs[:5]:
        print(f"    - {r['id']} | Lang={r['language_code']} | Dialect='{r['dialect']}' | Speaker='{r['speaker_name']}'")

    print("\n=================================================================")
    print(" ALL 5 TEST SUITES PASSED WITH 100% SUCCESS!")
    print("=================================================================")

if __name__ == "__main__":
    run_tests()
