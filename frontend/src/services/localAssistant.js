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
 * Matches a query against the knowledge base
 */
export function matchLocalQuery(queryText = '', langCode = 'hi', category = null) {
  const qLower = (queryText || '').toLowerCase().trim();
  const qTokens = new Set(cleanTokens(qLower));

  let bestItem = null;
  let bestScore = 0;

  // 1. Direct Pattern Matching for the 4 Essential Quick Prompts
  // Prompt 1: PM-KISAN (₹6,000 / year)
  if (
    qLower.includes('pm-kisan') ||
    qLower.includes('pm kisan') ||
    qLower.includes('6,000') ||
    qLower.includes('6000') ||
    qLower.includes('किसान') ||
    qLower.includes('రైతు') ||
    qLower.includes('କୃଷକ') ||
    qLower.includes('কৃষক') ||
    qLower.includes('kisan samman')
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
    qLower.includes('ఆరోగ్య') ||
    qLower.includes('ଚିକିତ୍ସା') ||
    qLower.includes('চিকিৎসা')
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
    qLower.includes('ସ୍କଲାରସିପ୍') ||
    qLower.includes('স্কলারশিপ')
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
    qLower.includes('ଠକେଇ') ||
    qLower.includes('জালিয়াতি')
  ) {
    const bankingItem = knowledgeBase.find(item => item.id === 'digital_banking_safety');
    if (bankingItem) return buildResponse(bankingItem, queryText, langCode, 1.0);
  }

  // 2. Comprehensive scoring across all knowledge items
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
    languageNotes = `Notice: Native browser speech voice is not available in browser engines for this language. Answer text is presented in verified native script (Manual Reading Mode).`;
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
• ఏకలవ్య పాఠశాలలు & గిరిజన స్కాలర్‌షిప్‌లు
• సురక్షిత బ్యాంకింగ్ & యూపీఐ పిన్ రక్షణ (సైబర్ హెల్ప్‌లైన్ 1930)`,
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
