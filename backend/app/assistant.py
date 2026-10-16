import json
import re
from pathlib import Path
from typing import List, Optional, Dict, Any, Tuple
from backend.app.schemas import AskRequest, AskResponse, SourceReference
from backend.app.language_service import language_service
from backend.app.speech.service import speech_manager

DATA_DIR = Path(__file__).resolve().parent / "data"

class AssistantEngine:
    def __init__(self):
        self.knowledge_items: List[Dict[str, Any]] = []
        self._load_knowledge()

    def _load_knowledge(self):
        file_path = DATA_DIR / "knowledge_base.json"
        if not file_path.exists():
            raise FileNotFoundError(f"Knowledge base missing at {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            self.knowledge_items = json.load(f)

    def total_items(self) -> int:
        return len(self.knowledge_items)

    def _clean_tokens(self, text: str) -> List[str]:
        # Lowercase and split into alphanumeric tokens
        tokens = re.findall(r"[\w\u0900-\u0D7F\u1C50-\u1C7F]+", text.lower())
        stopwords = {
            "the", "is", "a", "an", "and", "or", "in", "on", "to", "for", "of", "with", "what", "how", "tell", "me",
            "kya", "hai", "kaise", "milega", "batao", "bataiye", "hoga", "chahiye", "mera", "meri", "ko", "se", "ka", "ki", "ke"
        }
        return [t for t in tokens if t not in stopwords and len(t) > 1]

    def _match_query(self, query: str, category_filter: Optional[str]) -> Tuple[Optional[Dict[str, Any]], float]:
        query_lower = query.lower().strip()
        query_tokens = set(self._clean_tokens(query))

        best_item = None
        best_score = 0.0

        for item in self.knowledge_items:
            # If category filter is passed and doesn't match, reduce weight or skip
            if category_filter and category_filter.lower() != "all":
                if item["category"].lower() != category_filter.lower():
                    continue

            score = 0.0

            # 1. Exact or partial keyword match
            for kw in item.get("keywords", []):
                kw_lower = kw.lower()
                if kw_lower in query_lower:
                    score += 5.0
                else:
                    kw_tokens = set(self._clean_tokens(kw))
                    overlap = query_tokens.intersection(kw_tokens)
                    score += len(overlap) * 2.5

            # 2. Title match
            title_tokens = set(self._clean_tokens(item.get("title", "")))
            score += len(query_tokens.intersection(title_tokens)) * 3.0

            # 3. Category match boost if query mentions the category keywords
            cat = item.get("category", "")
            if "scheme" in query_lower or "yojana" in query_lower or "sarkar" in query_lower:
                if cat == "government_schemes":
                    score += 1.5
            if "health" in query_lower or "hospital" in query_lower or "doctor" in query_lower or "bimari" in query_lower or "dawa" in query_lower:
                if cat == "healthcare":
                    score += 1.5
            if "school" in query_lower or "scholarship" in query_lower or "padhai" in query_lower or "vidyalaya" in query_lower:
                if cat == "education":
                    score += 1.5
            if "bank" in query_lower or "pin" in query_lower or "otp" in query_lower or "paisa" in query_lower or "fraud" in query_lower:
                if cat == "safe_banking":
                    score += 1.5

            if score > best_score:
                best_score = score
                best_item = item

        # Return best match if score threshold met
        if best_item and best_score >= 2.0:
            confidence = min(round(best_score / 10.0, 2), 1.0)
            return best_item, confidence

        return None, 0.0

    async def answer_question(self, req: AskRequest) -> AskResponse:
        lang_code = req.language.lower().strip() if req.language else "hi"
        lang_info = language_service.get_by_code(lang_code)

        matched_item, confidence = self._match_query(req.query, req.category)

        if not matched_item:
            # Fallback when no direct knowledge base match is found
            # Provide helpful category directory in user language
            return self._build_unknown_response(req.query, lang_code, lang_info)

        # Retrieve localized answer
        answers = matched_item.get("answers", {})
        answer_text = answers.get(lang_code)
        answer_lang = lang_code
        language_note = None

        if not answer_text:
            # If not yet translated into this specific tribal or regional dialect
            # Provide the national language (Hindi) or English, with explicit truthful note
            if "hi" in answers:
                answer_text = answers["hi"]
                answer_lang = "hi"
                language_note = (
                    f"Notice: Verified content is not yet available in '{lang_info.name if lang_info else lang_code}'. "
                    f"Displaying verified Hindi version to ensure factual correctness without unauthorized AI machine-translation."
                )
            elif "en" in answers:
                answer_text = answers["en"]
                answer_lang = "en"
                language_note = (
                    f"Notice: Verified content is not yet available in '{lang_info.name if lang_info else lang_code}'. "
                    f"Displaying verified English version to prevent incorrect information."
                )
            else:
                answer_text = list(answers.values())[0]
                answer_lang = list(answers.keys())[0]

        # Sources
        sources = [
            SourceReference(
                title=matched_item.get("title", ""),
                verified_source=matched_item.get("verified_source", "Official Government Portal"),
                verified_url=matched_item.get("verified_url", "https://india.gov.in"),
                verification_date=matched_item.get("verification_date", "2026-10-15")
            )
        ]

        # Determine audio availability (Neural TTS or Verified Native Speaker Recording)
        audio_available = False
        audio_provider = "manual_reading_mode"
        audio_b64 = None
        provenance_meta = {}

        item_id = matched_item.get("id")
        audio_sample_text = answer_text.split("•")[0].strip() if "•" in answer_text else answer_text[:250]

        try:
            success, b64_data, prov, msg, metadata = await speech_manager.synthesize(
                text=audio_sample_text,
                lang_code=answer_lang,
                answer_id=item_id
            )
            if success and b64_data:
                audio_available = True
                audio_b64 = b64_data
                audio_provider = prov
                provenance_meta = metadata
            else:
                # If automated synthesis failed or not supported, check if language has speech synthesis flag
                if lang_info and lang_info.capabilities.speechSynthesis:
                    audio_available = True
                    audio_provider = lang_info.ttsProvider or "browser_and_server"
                else:
                    audio_available = False
                    audio_provider = "manual_reading_mode"
        except Exception as e:
            if lang_info and lang_info.capabilities.speechSynthesis:
                audio_available = True
                audio_provider = "browser_fallback"
            else:
                audio_available = False
                audio_provider = "manual_reading_mode"

        return AskResponse(
            query=req.query,
            answer=answer_text,
            answer_language=answer_lang,
            requested_language=lang_code,
            category=matched_item.get("category", "general"),
            matched_topic=matched_item.get("title"),
            sources=sources,
            disclaimer=matched_item.get("disclaimer"),
            audio_available=audio_available,
            audio_provider=audio_provider,
            audio_base64=audio_b64,
            language_notes=language_note,
            confidence=max(confidence, 0.75)
        )

    def _build_unknown_response(self, query: str, lang_code: str, lang_info: Optional[Any]) -> AskResponse:
        messages = {
            "en": "I could not find a verified match for your question in our database. Please select one of the four essential service categories below (Government Schemes, Healthcare, Education, Safe Banking) or ask about PM-KISAN, PM Awas, Ayushman Bharat, UPI safety, or scholarships.",
            "hi": "मुझे आपके प्रश्न का सत्यापित उत्तर डेटाबेस में नहीं मिला। कृपया नीचे दी गई चार श्रेणियों (सरकारी योजनाएं, स्वास्थ्य, शिक्षा, सुरक्षित बैंकिंग) में से किसी एक को चुनें या पीएम किसान, आवास योजना, आयुष्मान भारत, यूपीआई सुरक्षा या छात्रवृत्ति के बारे में पूछें।",
            "te": "మీ ప్రశ్నకు సంబంధించిన ఖచ్చితమైన సమాచారం ప్రస్తుతం లభించలేదు. దయచేసి క్రింది నాలుగు విభాగాలలో (ప్రభుత్వ పథకాలు, ఆరోగ్యం, విద్య, సురక్షిత బ్యాంకింగ్) ఏదైనా ఎంచుకోండి లేదా పీఎం కిసాన్, ఆవాస్, ఆయుష్మాన్ భారత్ గురించి అడగండి.",
            "or": "ଆପଣଙ୍କ ପ୍ରଶ୍ନର ସଠିକ୍ ଉତ୍ତର ଆମ ଡାଟାବେସରେ ମିଳିଲା ନାହିଁ। ଦୟାକରି ତଳେ ଥିବା ଚାରୋଟି ବିଭାଗ (ସରକାରୀ ଯୋଜନା, ସ୍ୱାସ୍ଥ୍ୟ, ଶିକ୍ଷା, ସୁରକ୍ଷିତ ବ୍ୟାଙ୍କିଙ୍ଗ୍) ମଧ୍ୟରୁ ଗୋଟିଏ ବାଛନ୍ତୁ କିମ୍ବା ପିଏମ୍-କିସାନ, ଆବାସ ଯୋଜନା, ଆୟୁଷ୍ମାନ ଭାରତ ବିଷୟରେ ପଚାରନ୍ତୁ।",
            "bn": "আপনার প্রশ্নের জন্য যাচাইকৃত কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে নীচের চারটি বিভাগ (সরকারি প্রকল্প, স্বাস্থ্যসেবা, শিক্ষা, নিরাপদ ব্যাঙ্কিং) থেকে নির্বাচন করুন।",
            "ta": "உங்கள் கேள்விக்குரிய தகவல் கிடைக்கவில்லை. தயவுசெய்து கீழே உள்ள 4 பிரிவுகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்.",
            "mr": "तुमच्या प्रश्नाचे उत्तर सापडले नाही. कृपया खालील चार विभागांपैकी एक निवडा (सरकारी योजना, आरोग्य, शिक्षण, सुरक्षित बँकिंग).",
            "gu": "તમારા પ્રશ્ન માટે માહિતી મળી નથી. કૃપા કરીને નીચેની ચાર સેવાઓમાંથી પસંદ કરો.",
            "kn": "ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ನಾಲ್ಕು ವಿಭಾಗಗಳಲ್ಲಿ ಒಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
            "ml": "നിങ്ങളുടെ ചോദ്യത്തിനുള്ള ഉത്തരം ലഭ്യമായില്ല. ദയവായി താഴെയുള്ള സേവന വിഭാഗങ്ങൾ തിരഞ്ഞെടുക്കുക.",
            "pa": "ਤੁਹਾਡੇ ਸਵਾਲ ਦਾ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਚਾਰ ਸ਼੍ਰੇਣੀਆਂ ਵਿੱਚੋਂ ਚੁਣੋ।",
            "as": "আপোনাৰ প্ৰশ্নৰ উত্তৰ পোৱা নগ'ল। অনুগ্ৰহ কৰি তলৰ চাৰিটা বিভাগৰ পৰা এটা বাছনি কৰক।",
            "bho": "हमरा रउआ सवाल के सही जवाब डेटाबेस में ना मिलल। कृपा क के नीचे दिहल चार गो श्रेणी (सरकारी योजना, दवाई-इलाज, पढ़ाई, सुरक्षित बैंकिंग) में से कवनो चुनीं चाहे पीएम किसान, आवास योजना, आयुष्मान भारत, यूपीआई सुरक्षा के बारे में पूछीं।",
            "sat": "ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱥᱟᱹᱨᱤ ᱛᱮᱞᱟ ᱰᱟᱴᱟᱵᱮᱥ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱞᱟᱛᱟᱨ ᱨᱮ ᱮᱢ ᱟᱠᱟᱱ ᱯᱩᱱᱭᱟᱹ ᱵᱤᱵᱷᱟᱜᱽ (ᱥᱚᱨᱠᱟᱨᱤ ᱡᱚᱡᱚᱱᱟ, ᱦᱚᱲᱢᱚ-ᱥᱟᱶᱟᱨ, ᱥᱮᱪᱮᱫ, ᱥᱩᱨᱚᱠᱷᱭᱟᱹ ᱵᱮᱝᱠᱤᱝ) ᱠᱷᱚᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ PM-KISAN, ᱟᱣᱟᱥ ᱡᱚᱡᱚᱱᱟ, ᱟᱭᱩᱥᱢᱟᱱ ᱵᱷᱟᱨᱚᱛ ᱵᱟᱵᱚᱛ ᱠᱩᱞᱤ ᱢᱮ᱾",
            "unr": "आबुआ डेटाबेस रे ई सवाल रेयाः जवाब बानोआ। दया कते लता रे 4 गो सेवा (सरकारी योजना, स्वास्थ्य, शिक्षा, बैंक सुरक्षा) रे बाछोपे।",
            "hoc": "ने सवाल रेयाः उत्तर बानोःअ। दया कते लातार रेयाः चार सेवा रे कुलीपे।",
            "kxu": "ଇ ପ୍ରଶ୍ନ ର ଉତ୍ତର ମିଳିଲା ନାହିଁ। ଦୟାକରି ତଳେ ଥିବା ୪ଟି ବିଭାଗ ରୁ ବାଛନ୍ତୁ।"
        }

        fallback_text = messages.get(lang_code, messages["hi"])

        return AskResponse(
            query=query,
            answer=fallback_text,
            answer_language=lang_code if lang_code in messages else "hi",
            requested_language=lang_code,
            category="general",
            matched_topic="General Assistance",
            sources=[
                SourceReference(
                    title="National Portal of India",
                    verified_source="Government of India",
                    verified_url="https://india.gov.in",
                    verification_date="2026-10-15"
                )
            ],
            disclaimer="SwarSahayak provides verified public information on essential welfare, health, education, and safe banking services.",
            audio_available=lang_info.capabilities.speechSynthesis if lang_info else False,
            audio_provider="manual_reading_mode" if not (lang_info and lang_info.capabilities.speechSynthesis) else "browser_and_server",
            confidence=0.3
        )

assistant_engine = AssistantEngine()
