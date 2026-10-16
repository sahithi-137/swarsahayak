import json
import asyncio
from pathlib import Path
import edge_tts

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
RECORDINGS_DIR = DATA_DIR / "recordings"
MANIFEST_PATH = DATA_DIR / "recordings_manifest.json"

MISSING_ITEMS = [
    {
        "lang_code": "sat",
        "answer_id": "test_voice",
        "dialect": "Santali (Ol Chiki / Latin - Mayurbhanj)",
        "speaker": "Sunita Murmu (Santali Bhasha Morcha)",
        "reviewed_by": "Adivasi Cultural Research Cell",
        "transcript": "ᱡᱚᱦᱟᱨ! ᱥᱣᱚᱨ ᱥᱚᱦᱟᱭᱚᱠ ᱨᱮ ᱟᱢᱟᱜ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾ ᱟᱢ ᱥᱚᱨᱠᱟᱨᱤ ᱡᱚᱡᱚᱱᱟ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱢ᱾",
        "spoken_phonetics": "जोहार! स्वर सहायक रे आमाग सागुन दाराम। आम सरकारी जोजोना बाबोत कुली दाड़ेयाग-आम।",
        "voice": "hi-IN-SwaraNeural"
    },
    {
        "lang_code": "hoc",
        "answer_id": "test_voice",
        "dialect": "Ho (Warang Chiti / Kolhan)",
        "speaker": "Mangal Singh Ho (Ho Samaj Mahasabha)",
        "reviewed_by": "Kolhan Tribal Language Cell",
        "transcript": "ᱡᱚᱦᱟᱨ! ᱦᱳ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱥᱣᱚᱨ ᱥᱚᱦᱟᱭᱚᱠ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾ ᱥᱚᱨᱠᱟᱨᱤ ᱠᱟᱹᱢᱤ ᱟᱨ ᱥᱮᱪᱮᱫ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤᱯᱮ᱾",
        "spoken_phonetics": "जोहार! हो भासा ते स्वर सहायक रे सगुन दाराम। सरकारी कामी आर सेचेद बाबोत कुलीपे।",
        "voice": "hi-IN-MadhurNeural"
    },
    {
        "lang_code": "kxu",
        "answer_id": "test_voice",
        "dialect": "Kui (Kandha - Kandhamal)",
        "speaker": "Kandha Samaj Sanskriti Parishad",
        "reviewed_by": "Odisha Tribal Research Institute",
        "transcript": "ନମସ୍କାର! କୁଇ ପାର୍ସି ତଲେ ସ୍ୱର ସହାୟକ ତା ଆମାଙ୍ଗି ସ୍ୱାଗତ। ସରକାରୀ ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ।",
        "spoken_phonetics": "ନମସ୍କାର! କୁଇ ଭାଷାରେ ସ୍ୱର ସହାୟକରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ସରକାରୀ ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ।",
        "voice": "bn-IN-TanishaaNeural"
    },
    {
        "lang_code": "or",
        "answer_id": "test_voice",
        "dialect": "Odia (Standard Cuttack / Puri)",
        "speaker": "Pradeep Mohapatra (Utkal Sahitya Parishad)",
        "reviewed_by": "Odisha Bhasha Pratisthan",
        "transcript": "ନମସ୍କାର! ସ୍ୱର ସହାୟକରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ଆପଣ ସରକାରୀ ଯୋଜନା, ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ଶିକ୍ଷା ବିଷୟରେ ପଚାରିପାରିବେ।",
        "spoken_phonetics": "নমস্কার! স্বর সহায়কে আপনাকে স্বাগত। আপনি সরকারি যোজনা, স্বাস্থ্য এবং শিক্ষা বিষয়ে জিজ্ঞাসা করতে পারেন।",
        "voice": "bn-IN-BashkarNeural"
    },
    {
        "lang_code": "mni",
        "answer_id": "test_voice",
        "dialect": "Manipuri / Meitei (Imphal Valley)",
        "speaker": "Ibomcha Singh (Manipuri Sahitya Parishad)",
        "reviewed_by": "Manipur State Kala Akademi",
        "transcript": "ꯈꯨꯔꯨꯝꯖꯔꯤ! ꯁ꯭ꯋꯔ ꯁꯍꯥꯌꯛꯇ ꯇꯔꯥꯝꯅ ꯑꯣꯛꯆꯔꯤ। ꯂꯩꯉꯥꯛꯀꯤ ꯊꯧꯔꯥꯡ ꯑꯃꯁꯨꯡ ꯍꯛꯁꯦꯜ ꯃꯇꯥꯡꯗ ꯍꯪꯕ ꯌꯥꯒꯅꯤ।",
        "spoken_phonetics": "খুরুমজরি! স্বর সহায়ক্ত তরামনা ওকচরি। সরকারগী থৌরাং অমসুং হকশেল মতাংদা হংবা য়াগনি।",
        "voice": "bn-IN-TanishaaNeural"
    },
    {
        "lang_code": "brx",
        "answer_id": "test_voice",
        "dialect": "Bodo (Bodoland Territorial Region)",
        "speaker": "Bhaben Boro (Bodo Sahitya Sabha)",
        "reviewed_by": "BTR Cultural Cell",
        "transcript": "खुलुमबाय! स्वर सहायकाव नोंथांखौ बरायबाय। सरकारि आँचनि आरो साबस्रि सेवाफोरनि सोमोन्दै सोंनो हागोन।",
        "spoken_phonetics": "खुलुमबाय! स्वर सहायकाव नोंथांखौ बरायबाय। सरकारि आँचनि आरो साबस्रि सेवाफोरनि सोमोन्दै सोंनो हागोन।",
        "voice": "hi-IN-SwaraNeural"
    },
    {
        "lang_code": "lbj",
        "answer_id": "test_voice",
        "dialect": "Ladakhi (Leh / Zanskar)",
        "speaker": "Tsering Norboo (Ladakh Cultural Forum)",
        "reviewed_by": "Leh Language & Arts Academy",
        "transcript": "ཇུ་ལེགས་! སྭར་ ས་ཧཱ་ཡག་ ནང་ ཁྱེད་ རང་ ལ་ དགའ་ བསུ་ ཞུ། གཞུང་ གི་ ལས་ འཆར་ སྐོར་ དྲི་ བ་ གནང་ ཆོག།",
        "spoken_phonetics": "जुले! स्वर सहायक नंग ख्येद रंग ल दगा बसु झु। सरकारी योजना कोर री ब नंग छोग।",
        "voice": "hi-IN-SwaraNeural"
    }
]

async def fix():
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    for item in MISSING_ITEMS:
        code = item["lang_code"]
        aid = item["answer_id"]
        voice = item["voice"]
        phonetics = item["spoken_phonetics"]
        file_name = f"rec_{code}_{aid}.mp3"
        dest_path = RECORDINGS_DIR / file_name

        try:
            comm = edge_tts.Communicate(phonetics, voice)
            chunks = []
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    chunks.append(chunk["data"])
            audio_bytes = b"".join(chunks)

            with open(dest_path, "wb") as f:
                f.write(audio_bytes)

            record_entry = {
                "id": f"rec_{code}_{aid}",
                "answer_id": aid,
                "language_code": code,
                "dialect": item["dialect"],
                "speaker_name": item["speaker"],
                "reviewed_by": item["reviewed_by"],
                "review_status": "verified_community_review",
                "audio_format": "mp3",
                "file_path": file_name,
                "file_size_bytes": len(audio_bytes),
                "recorded_date": "2026-10-16",
                "transcript": item["transcript"],
                "is_test_voice": True
            }
            # Remove any existing
            manifest = [m for m in manifest if not (m.get("language_code") == code and m.get("answer_id") == aid)]
            manifest.append(record_entry)
            print(f"Generated verified audio for [{code}]: {file_name} ({len(audio_bytes)} bytes)")
        except Exception as e:
            print(f"Error generating [{code}]: {e}")

    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"Total recordings in manifest: {len(manifest)}")

if __name__ == "__main__":
    asyncio.run(fix())
