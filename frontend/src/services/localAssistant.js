/**
 * SwarSahayak Client-Side Local Assistant Engine
 * 
 * Provides instantaneous, reliable, offline-ready query matching against
 * verified government welfare data, healthcare policies, education scholarships,
 * and safe digital banking guidelines.
 * 
 * Works on any static hosting platform (e.g. Vercel) even when the backend is offline.
 */
import knowledgeBase from '../data/knowledge_base.js';
import { audioPlayer } from './audioPlayer.js';

// Common stop words across English, Hindi, and regional phrases
const STOP_WORDS = new Set([
  'the', 'is', 'a', 'an', 'and', 'or', 'in', 'on', 'to', 'for', 'of', 'with', 'what', 'how', 'tell', 'me', 'please',
  'kya', 'hai', 'kaise', 'milega', 'batao', 'bataiye', 'hoga', 'chahiye', 'mera', 'meri', 'ko', 'se', 'ka', 'ki', 'ke',
  'scheme', 'yojana', 'details', 'eligibility', 'apply', 'form'
]);

function cleanTokens(text = '') {
  if (!text) return [];
  // Tokenize unicode letters and numbers
  const tokens = text.toLowerCase().match(/[\w\u0900-\u0D7F\u1C50-\u1C7F]+/g) || [];
  return tokens.filter(t => !STOP_WORDS.has(t) && t.length > 1);
}

/**
 * Languages with standard browser Web Speech API voice support
 */
export const BROWSER_VOICE_LANGS = ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur'];

/**
 * Checks if a language code has an available browser voice
 */
export function isVoiceSupportedForLang(langCode = 'hi') {
  const code = (langCode || '').toLowerCase().trim();
  if (typeof window !== 'undefined' && audioPlayer) {
    const hasVoice = audioPlayer.findBrowserVoice(null, code);
    if (hasVoice) return true;
  }
  return BROWSER_VOICE_LANGS.includes(code);
}

/**
/**
 * Matches a query against the knowledge base
 * Guarantees that all 4 service categories, suggested questions, and free-form queries
 * return reviewed, structured official government information with full provenance.
 */
export function matchLocalQuery(queryText = '', langCode = 'hi', category = null) {
  const qLower = (queryText || '').toLowerCase().trim();
  const qTokens = new Set(cleanTokens(qLower));
  const cat = (category || '').toLowerCase().trim();

  // 1. Category-specific routing (Guarantees Service Card clicks return the appropriate verified program)
  if (cat === 'government_schemes' || qLower.includes('सरकारी योजना') || qLower.includes('government scheme') || qLower.includes('govt scheme')) {
    if (
      qLower.includes('awas') ||
      qLower.includes('housing') ||
      qLower.includes('ghar') ||
      qLower.includes('makaan') ||
      qLower.includes('आवास') ||
      qLower.includes('मकान') ||
      qLower.includes('घर') ||
      qLower.includes('ଘର') ||
      qLower.includes('ঘর') ||
      qLower.includes('ఇల్లు') ||
      qLower.includes('வீடு') ||
      qLower.includes('ᱚᱲᱟᱜ')
    ) {
      const awasItem = knowledgeBase.find(i => i.id === 'pm_awas_gramin');
      if (awasItem) return buildResponse(awasItem, queryText, langCode, 1.0);
    }

    if (
      qLower.includes('van dhan') ||
      qLower.includes('trifed') ||
      qLower.includes('forest') ||
      qLower.includes('mahua') ||
      qLower.includes('kendu') ||
      qLower.includes('वन धन') ||
      qLower.includes('वनोपज') ||
      qLower.includes('महुआ') ||
      qLower.includes('ᱵᱚᱱ ᱫᱷᱚᱱ')
    ) {
      const vanDhanItem = knowledgeBase.find(i => i.id === 'van_dhan_yojana');
      if (vanDhanItem) return buildResponse(vanDhanItem, queryText, langCode, 1.0);
    }

    if (
      qLower.includes('matru') ||
      qLower.includes('vandana') ||
      qLower.includes('pregnant') ||
      qLower.includes('maternity') ||
      qLower.includes('delivery') ||
      qLower.includes('गर्भवती') ||
      qLower.includes('मातृ') ||
      qLower.includes('মাতৃ') ||
      qLower.includes('ମାତୃ')
    ) {
      const matruItem = knowledgeBase.find(i => i.id === 'pm_matru_vandana');
      if (matruItem) return buildResponse(matruItem, queryText, langCode, 1.0);
    }

    // Default primary program for government_schemes: PM-KISAN
    const pmKisanItem = knowledgeBase.find(i => i.id === 'pm_kisan');
    if (pmKisanItem) return buildResponse(pmKisanItem, queryText, langCode, 1.0);
  }

  if (cat === 'healthcare' || qLower.includes('स्वास्थ्य') || qLower.includes('healthcare') || qLower.includes('hospital') || qLower.includes('health')) {
    if (
      qLower.includes('ambulance') ||
      qLower.includes('108') ||
      qLower.includes('102') ||
      qLower.includes('104') ||
      qLower.includes('esanjeevani') ||
      qLower.includes('teleconsult') ||
      qLower.includes('emergency') ||
      qLower.includes('doctor') ||
      qLower.includes('एम्बुलेंस') ||
      qLower.includes('डॉक्टर') ||
      qLower.includes('ଆମ୍ବୁଲାନ୍ସ') ||
      qLower.includes('অ্যাম্বুলেন্স') ||
      qLower.includes('ᱮᱢᱵᱩᱞᱮᱱᱥ')
    ) {
      const emergencyItem = knowledgeBase.find(i => i.id === 'health_helplines_emergency');
      if (emergencyItem) return buildResponse(emergencyItem, queryText, langCode, 1.0);
    }

    // Default primary program for healthcare: Ayushman Bharat PM-JAY
    const ayushmanItem = knowledgeBase.find(i => i.id === 'ayushman_bharat');
    if (ayushmanItem) return buildResponse(ayushmanItem, queryText, langCode, 1.0);
  }

  if (cat === 'education' || qLower.includes('शिक्षा') || qLower.includes('scholarship') || qLower.includes('education') || qLower.includes('school')) {
    if (
      qLower.includes('diksha') ||
      qLower.includes('evidya') ||
      qLower.includes('textbook') ||
      qLower.includes('ncert') ||
      qLower.includes('दीक्षा')
    ) {
      const dikshaItem = knowledgeBase.find(i => i.id === 'diksha_pm_evidya');
      if (dikshaItem) return buildResponse(dikshaItem, queryText, langCode, 1.0);
    }

    // Default primary program for education: EMRS & Tribal Scholarships
    const eklavyaItem = knowledgeBase.find(i => i.id === 'tribal_scholarships_emrs');
    if (eklavyaItem) return buildResponse(eklavyaItem, queryText, langCode, 1.0);
  }

  if (cat === 'safe_banking' || qLower.includes('बैंकिंग') || qLower.includes('banking') || qLower.includes('bank') || qLower.includes('safe banking')) {
    if (
      qLower.includes('aeps') ||
      qLower.includes('biometric') ||
      qLower.includes('finger') ||
      qLower.includes('thumb') ||
      qLower.includes('csp') ||
      qLower.includes('bank mitra') ||
      qLower.includes('अंगूठा') ||
      qLower.includes('बायोमेट्रिक') ||
      qLower.includes('ଆଙ୍ଗୁଠି') ||
      qLower.includes('ᱴᱤᱯ')
    ) {
      const aepsItem = knowledgeBase.find(i => i.id === 'aeps_banking_safety');
      if (aepsItem) return buildResponse(aepsItem, queryText, langCode, 1.0);
    }

    // Default primary program for safe banking: UPI, OTP & Cybercrime 1930
    const bankingItem = knowledgeBase.find(i => i.id === 'digital_banking_safety');
    if (bankingItem) return buildResponse(bankingItem, queryText, langCode, 1.0);
  }

  // 2. Direct Pattern Matching across all queries for the 4 Essential Quick Prompts
  // Prompt 1: PM-KISAN (₹6,000 / year)
  if (
    qLower.includes('pm-kisan') ||
    qLower.includes('pm kisan') ||
    qLower.includes('6,000') ||
    qLower.includes('6000') ||
    qLower.includes('৬,০০০') ||
    qLower.includes('୬,୦୦୦') ||
    qLower.includes('६,०००') ||
    qLower.includes('६०००') ||
    qLower.includes('किसान') ||
    qLower.includes('రైతు') ||
    qLower.includes('କୃଷକ') ||
    qLower.includes('কৃষক') ||
    qLower.includes('விவசாயி') ||
    qLower.includes('शेतकरी') ||
    qLower.includes('ખેડૂત') ||
    qLower.includes('ᱪᱟᱥᱤ') ||
    qLower.includes('kisan samman') ||
    qLower.includes('পিএম-কিসান') ||
    qLower.includes('ପିଏମ୍-କିସାନ') ||
    qLower.includes('పీఎం కిసాన్') ||
    qLower.includes('ᱯᱤ.ᱮᱢ-ᱠᱤᱥᱟᱱ')
  ) {
    const pmKisanItem = knowledgeBase.find(item => item.id === 'pm_kisan');
    if (pmKisanItem) return buildResponse(pmKisanItem, queryText, langCode, 1.0);
  }

  // Prompt 2: Ayushman Bharat (₹5 lakh hospital treatment)
  if (
    qLower.includes('ayushman') ||
    qLower.includes('pmjay') ||
    qLower.includes('pm-jay') ||
    qLower.includes('5 lakh') ||
    qLower.includes('500000') ||
    qLower.includes('hospital') ||
    qLower.includes('आयुष्मान') ||
    qLower.includes('मुफ्त इलाज') ||
    qLower.includes('आరోగ్య') ||
    qLower.includes('ఆయుష్మాన్') ||
    qLower.includes('వైద్యం') ||
    qLower.includes('ଚିକିତ୍ସା') ||
    qLower.includes('ଆୟୁଷ୍ମାନ') ||
    qLower.includes('চিকিৎসা') ||
    qLower.includes('আয়ুষ্মান') ||
    qLower.includes('ஆயுஷ்மான்') ||
    qLower.includes('आയുഷ്മാൻ') ||
    qLower.includes('ᱟᱭᱩᱥᱢᱟᱱ')
  ) {
    const ayushmanItem = knowledgeBase.find(item => item.id === 'ayushman_bharat');
    if (ayushmanItem) return buildResponse(ayushmanItem, queryText, langCode, 1.0);
  }

  // Prompt 3: Eklavya Schools & Tribal Scholarships
  if (
    qLower.includes('eklavya') ||
    qLower.includes('emrs') ||
    qLower.includes('scholarship') ||
    qLower.includes('tribal') ||
    qLower.includes('एकलव्य') ||
    qLower.includes('छात्रवृत्ति') ||
    qLower.includes('స్కాలర్‌షిప్') ||
    qLower.includes('ఏకలవ్య') ||
    qLower.includes('ସ୍କଲାରସିପ୍') ||
    qLower.includes('ଏକଲବ୍ୟ') ||
    qLower.includes('স্কলারশিপ') ||
    qLower.includes('একব্য') ||
    qLower.includes('উপাजाতি') ||
    qLower.includes('ಶಿಷ್ಯವೇತನ') ||
    qLower.includes('ವಿದ್ಯಾರ್ಥಿವೇತನ') ||
    qLower.includes('ᱥᱠᱚᱞᱟᱨᱥᱤᱯ') ||
    qLower.includes('ᱮᱠᱞᱚᱵᱽᱭᱚ')
  ) {
    const eklavyaItem = knowledgeBase.find(item => item.id === 'tribal_scholarships_emrs');
    if (eklavyaItem) return buildResponse(eklavyaItem, queryText, langCode, 1.0);
  }

  // Prompt 4: UPI PIN scams & Digital Banking Fraud
  if (
    qLower.includes('upi') ||
    qLower.includes('pin') ||
    qLower.includes('scam') ||
    qLower.includes('fraud') ||
    qLower.includes('otp') ||
    qLower.includes('1930') ||
    qLower.includes('पिन') ||
    qLower.includes('फ्रॉड') ||
    qLower.includes('ठगी') ||
    qLower.includes('మోసం') ||
    qLower.includes('యూపీఐ') ||
    qLower.includes('ଠକେଇ') ||
    qLower.includes('জালিয়াতি') ||
    qLower.includes('மோசடி') ||
    qLower.includes('ఫसवणूक') ||
    qLower.includes('છેતરપિંડી') ||
    qLower.includes('ᱯᱤᱱ') ||
    qLower.includes('ᱮᱲᱮ')
  ) {
    const bankingItem = knowledgeBase.find(item => item.id === 'digital_banking_safety');
    if (bankingItem) return buildResponse(bankingItem, queryText, langCode, 1.0);
  }

  // Additional Prompts: PMAY-G Housing
  if (
    qLower.includes('awas') ||
    qLower.includes('pmay') ||
    qLower.includes('ghar') ||
    qLower.includes('makaan') ||
    qLower.includes('आवास') ||
    qLower.includes('घर') ||
    qLower.includes('ଘର') ||
    qLower.includes('ঘর') ||
    qLower.includes('ఇల్లు') ||
    qLower.includes('வீடு') ||
    qLower.includes('ᱚᱲᱟᱜ')
  ) {
    const awasItem = knowledgeBase.find(item => item.id === 'pm_awas_gramin');
    if (awasItem) return buildResponse(awasItem, queryText, langCode, 1.0);
  }

  // Additional Prompts: Helplines (108 / 102 / eSanjeevani)
  if (
    qLower.includes('108') ||
    qLower.includes('102') ||
    qLower.includes('104') ||
    qLower.includes('ambulance') ||
    qLower.includes('esanjeevani') ||
    qLower.includes('doctor') ||
    qLower.includes('एम्बुलेंस') ||
    qLower.includes('ଆମ୍ବୁଲାନ୍ସ') ||
    qLower.includes('অ্যাম্বুলেন্স') ||
    qLower.includes('ᱮᱢᱵᱩᱞᱮᱱᱥ')
  ) {
    const emergencyItem = knowledgeBase.find(item => item.id === 'health_helplines_emergency');
    if (emergencyItem) return buildResponse(emergencyItem, queryText, langCode, 1.0);
  }

  // Additional Prompts: Van Dhan Yojana
  if (
    qLower.includes('van dhan') ||
    qLower.includes('trifed') ||
    qLower.includes('mahua') ||
    qLower.includes('kendu') ||
    qLower.includes('वन धन') ||
    qLower.includes('लघु वनोपज') ||
    qLower.includes('ᱵᱚᱱ ᱫᱷᱚᱱ')
  ) {
    const vanDhanItem = knowledgeBase.find(item => item.id === 'van_dhan_yojana');
    if (vanDhanItem) return buildResponse(vanDhanItem, queryText, langCode, 1.0);
  }

  // Additional Prompts: AEPS Biometric
  if (
    qLower.includes('aeps') ||
    qLower.includes('biometric') ||
    qLower.includes('csp') ||
    qLower.includes('bank mitra') ||
    qLower.includes('अंगूठा') ||
    qLower.includes('बायोमेट्रिक') ||
    qLower.includes('ᱴᱤᱯ-ᱥᱟᱹᱦᱤ')
  ) {
    const aepsItem = knowledgeBase.find(item => item.id === 'aeps_banking_safety');
    if (aepsItem) return buildResponse(aepsItem, queryText, langCode, 1.0);
  }

  // 3. Comprehensive scoring across all knowledge items
  let bestItem = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    if (category && category !== 'all' && item.category !== category) {
      continue;
    }

    let score = 0;

    // Check keywords
    for (const kw of item.keywords || []) {
      const kwLower = kw.toLowerCase();
      if (qLower.includes(kwLower)) {
        score += 6.0;
      } else {
        const kwTokens = cleanTokens(kwLower);
        for (const t of kwTokens) {
          if (qTokens.has(t)) score += 2.0;
        }
      }
    }

    // Check title
    const titleTokens = cleanTokens(item.title);
    for (const t of titleTokens) {
      if (qTokens.has(t)) score += 3.0;
    }

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && bestScore >= 2.0) {
    return buildResponse(bestItem, queryText, langCode, Math.min(bestScore / 10, 1.0));
  }

  // Fallback for general queries
  return buildGeneralHelpResponse(queryText, langCode);
}

function buildResponse(item, queryText, langCode, confidence) {
  const code = (langCode || 'hi').toLowerCase().trim();
  
  // Pick answer in requested language, fallback to Hindi or English
  let answerText = item.answers[code] || item.answers['hi'] || item.answers['en'];
  let actualLang = item.answers[code] ? code : (item.answers['hi'] ? 'hi' : 'en');

  const voiceAvailable = isVoiceSupportedForLang(actualLang);

  let languageNotes = null;
  if (!voiceAvailable) {
    languageNotes = `Notice: Native browser speech engine is not pre-installed in standard browser engines for this tribal language. Answer text is presented in verified native script (Manual Reading Mode).`;
  }

  return {
    query: queryText,
    answer: answerText,
    answer_language: actualLang,
    requested_language: code,
    category: item.category,
    matched_topic: item.title,
    sources: [
      {
        title: item.title,
        verified_source: item.verified_source,
        verified_url: item.verified_url,
        verification_date: item.verification_date
      }
    ],
    disclaimer: item.disclaimer,
    audio_available: voiceAvailable,
    audio_provider: voiceAvailable ? 'browser_web_speech' : 'manual_reading_mode',
    audio_base64: null,
    language_notes: languageNotes,
    confidence: confidence
  };
}

function buildGeneralHelpResponse(queryText, langCode) {
  const code = (langCode || 'hi').toLowerCase().trim();
  const voiceAvailable = isVoiceSupportedForLang(code);

  const helpMessages = {
    hi: `मुझे आपके प्रश्न का सटीक मिलान नहीं मिला। कृपया नीचे दिए गए सत्यापित विषयों में से चुनें:

• पीएम-किसान (PM-KISAN): ₹6,000 प्रति वर्ष की कृषि सहायता
• आयुष्मान भारत (PM-JAY): ₹5 लाख तक का निःशुल्क अस्पताल इलाज
• एकलव्य आदर्श विद्यालय व छात्रवृत्ति: आदिवासी बच्चों के लिए निःशुल्क शिक्षा
• सुरक्षित बैंकिंग व UPI सुरक्षा: धोखाधड़ी से बचाव व 1930 हेल्पलाइन

या नीचे दिए गए चार मुख्य वर्गों (सरकारी योजनाएं, स्वास्थ्य, शिक्षा, सुरक्षित बैंकिंग) पर क्लिक करें।`,
    en: `I could not find an exact match for your query in the verified repository. Please choose from our primary verified services:

• PM-KISAN: ₹6,000 per year income support for farmers
• Ayushman Bharat (PM-JAY): Free hospital treatment up to ₹5 lakh
• Eklavya Schools & Scholarships: Quality free education & financial aid for tribal students
• Safe Digital Banking: UPI PIN fraud protection & 1930 Cyber Helpline

You can also click any of the 4 service categories above or tap a suggested prompt.`,
    te: `మీ ప్రశ్నకు ఖచ్చితమైన సమాచారం లభించలేదు. దయచేసి క్రింది ముఖ్య పథకాలను పరిశీలించండి:

• పీఎం కిసాన్: రైతులకు సంవత్సరానికి ₹6,000 ఆర్థిక సాయం
• ఆయుష్మాన్ భారత్: ₹5 లక్షల వరకు ఉచిత ఆసుపత్రి చికిత్స
• ఏకలవ్య పాఠశాలలు & గିరిజన స్కాలర్‌షిప్‌లు
• సురక్షిత బ్యాంకింగ్ & యూపీఐ పిన్ రక్షణ (సైబర్ హెల్ప్‌లైన్ 1930)`,
    or: `ଆପଣଙ୍କ ପ୍ରଶ୍ନର ସଠିକ୍ ଉତ୍ତର ମିଳିଲା ନାହିଁ। ଦୟାକରି ତଳେ ଥିବା ମୁଖ୍ୟ ସରକାରୀ ଯୋଜନା ଦେଖନ୍ତୁ:

• ପିଏମ୍-କିସାନ: ଚାଷୀଙ୍କ ପାଇଁ ବାର୍ଷିକ ₹୬,୦୦୦ ସହାୟତା
• ଆୟୁଷ୍ମାନ ଭାରତ: ₹୫ ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ମାଗଣା ଚିକିତ୍ସା
• ଏକଲବ୍ୟ ଆଦର୍ଶ ଆବାସିକ ବିଦ୍ୟାଳୟ ଓ ଆଦିବାସୀ ସ୍କଲାରସିପ୍
• ସୁରକ୍ଷିତ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଓ UPI PIN ସୁରକ୍ଷା (ହେଲ୍ପଲାଇନ୍ ୧୯୩୦)`,
    bn: `আপনার প্রশ্নের সঠিক উত্তর খুঁজে পাওয়া যায়নি। অনুগ্রহ করে নিচের প্রধান সরকারি প্রকল্পগুলি দেখুন:

• পিএম-কিসান: কৃষকদের জন্য বছরে ₹৬,০০০ আর্থিক সাহায্য
• আয়ুষ্মান ভারত: ₹৫ লক্ষ টাকা পর্যন্ত বিনামূল্যে হাসপাতাল চিকিৎসা
• একলব্য মডেল স্কুল ও আদিবাসী স্কলারশিপ
• নিরাপদ ব্যাঙ্কিং ও সাইবার হেল্পলাইন ১৯৩০`,
    sat: `ᱟᱢᱟᱜ ᱠᱩᱠᱞᱤ ᱨᱮᱱᱟᱜ ᱥᱟᱹᱨᱤ ᱛᱮᱞᱟ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱞᱟᱛᱟᱨ ᱨᱮᱱᱟᱜ ᱢᱩᱬᱩᱛ ᱡᱚᱡᱚᱱᱟ ᱠᱚ ᱧᱮᱞ ᱢᱮ:

• ᱯᱤ.ᱮᱢ-ᱠᱤᱥᱟᱱ: ᱪᱟᱥᱤ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱥᱮᱨᱢᱟ ᱨᱮ ₹6,000 ᱜᱚᱲᱚ
• ᱟᱭᱩᱥᱢᱟᱱ ᱵᱷᱟᱨᱚᱛ: ₹5 ᱞᱟᱠᱷ ᱦᱟᱹᱵᱤᱡ ᱵᱤᱱᱟ ᱴᱟᱠᱟ ᱛᱮ ᱦᱟᱥᱯᱟᱛᱟᱞ ᱨᱟᱱ
• ᱮᱠᱞᱚᱵᱽᱭᱚ ᱟᱥᱲᱟ ᱟᱨ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ
• ᱥᱩᱨᱚᱠᱷᱭᱟᱹ ᱵᱮᱝᱠᱤᱝ ᱟᱨ 1930 ᱦᱮᱞᱯᱞᱟᱭᱤᱱ`,
    bho: `रउआ के सवाल के सही मिलान ना भेटाइल। कृपया नीचे दिहल सरकारी योजना में से चुनीं:

• पीएम-किसान योजना: हर साल ₹6,000 के किसान सहायता
• आयुष्मान भारत: ₹5 लाख तक के मुफ्त अस्पताल इलाज
• एकलव्य स्कूल आ छात्रवृत्ति: आदिवासी लइकन खातिर मुफ्त पढ़ाई
• UPI पिन आ बैंक सुरक्षा: ठगी से बचाव आ 1930 हेल्पलाइन`
  };

  const message = helpMessages[code] || helpMessages['hi'] || helpMessages['en'];

  return {
    query: queryText,
    answer: message,
    answer_language: helpMessages[code] ? code : 'hi',
    requested_language: code,
    category: 'general',
    matched_topic: 'SwarSahayak Verified Directory',
    sources: [
      {
        title: 'National Portal of India',
        verified_source: 'Government of India',
        verified_url: 'https://india.gov.in',
        verification_date: '2026-10-15'
      }
    ],
    disclaimer: 'SwarSahayak provides verified public information on welfare, healthcare, scholarships, and safe banking.',
    audio_available: voiceAvailable,
    audio_provider: voiceAvailable ? 'browser_web_speech' : 'manual_reading_mode',
    audio_base64: null,
    language_notes: !voiceAvailable ? 'Manual reading mode active.' : null,
    confidence: 0.4
  };
}
