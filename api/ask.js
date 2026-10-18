import { knowledgeBase } from './knowledge_base.js';

const BROWSER_VOICE_LANGS = ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur'];

function isVoiceSupportedForLang(langCode = 'hi') {
  const code = (langCode || '').toLowerCase().trim();
  return BROWSER_VOICE_LANGS.includes(code);
}

function cleanTokens(text = '') {
  if (!text) return [];
  const tokens = text.toLowerCase().match(/[\w\u0900-\u0D7F\u1C50-\u1C7F]+/g) || [];
  return tokens.filter(t => t.length > 1);
}

function matchLocalQuery(queryText = '', langCode = 'hi', category = null) {
  const qLower = (queryText || '').toLowerCase().trim();
  const qTokens = new Set(cleanTokens(qLower));
  const cat = (category || '').toLowerCase().trim();

  // 1. Category-specific routing
  if (cat === 'government_schemes' || qLower.includes('सरकारी योजना') || qLower.includes('government scheme') || qLower.includes('govt scheme')) {
    if (
      qLower.includes('awas') || qLower.includes('housing') || qLower.includes('ghar') ||
      qLower.includes('makaan') || qLower.includes('आवास') || qLower.includes('घर') ||
      qLower.includes('ଘର') || qLower.includes('ঘর') || qLower.includes('ఇల్లు') || qLower.includes('வீடு')
    ) {
      const item = knowledgeBase.find(i => i.id === 'pm_awas_gramin');
      if (item) return buildResponse(item, queryText, langCode, 1.0);
    }

    if (
      qLower.includes('van dhan') || qLower.includes('trifed') || qLower.includes('forest') ||
      qLower.includes('mahua') || qLower.includes('kendu') || qLower.includes('वन धन')
    ) {
      const item = knowledgeBase.find(i => i.id === 'van_dhan_yojana');
      if (item) return buildResponse(item, queryText, langCode, 1.0);
    }

    if (
      qLower.includes('matru') || qLower.includes('vandana') || qLower.includes('pregnant') ||
      qLower.includes('maternity') || qLower.includes('गर्भवती') || qLower.includes('मातृ')
    ) {
      const item = knowledgeBase.find(i => i.id === 'pm_matru_vandana');
      if (item) return buildResponse(item, queryText, langCode, 1.0);
    }

    const item = knowledgeBase.find(i => i.id === 'pm_kisan');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  if (cat === 'healthcare' || qLower.includes('स्वास्थ्य') || qLower.includes('healthcare') || qLower.includes('hospital')) {
    if (
      qLower.includes('ambulance') || qLower.includes('108') || qLower.includes('102') ||
      qLower.includes('104') || qLower.includes('esanjeevani') || qLower.includes('doctor') ||
      qLower.includes('एम्बुलेंस') || qLower.includes('ଆମ୍ବୁଲାନ୍ସ')
    ) {
      const item = knowledgeBase.find(i => i.id === 'health_helplines_emergency');
      if (item) return buildResponse(item, queryText, langCode, 1.0);
    }

    const item = knowledgeBase.find(i => i.id === 'ayushman_bharat');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  if (cat === 'education' || qLower.includes('शिक्षा') || qLower.includes('scholarship') || qLower.includes('school')) {
    if (
      qLower.includes('diksha') || qLower.includes('evidya') || qLower.includes('textbook') ||
      qLower.includes('ncert') || qLower.includes('दीक्षा')
    ) {
      const item = knowledgeBase.find(i => i.id === 'diksha_pm_evidya');
      if (item) return buildResponse(item, queryText, langCode, 1.0);
    }

    const item = knowledgeBase.find(i => i.id === 'tribal_scholarships_emrs');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  if (cat === 'safe_banking' || qLower.includes('बैंकिंग') || qLower.includes('banking') || qLower.includes('bank')) {
    if (
      qLower.includes('aeps') || qLower.includes('biometric') || qLower.includes('finger') ||
      qLower.includes('thumb') || qLower.includes('csp') || qLower.includes('अंगूठा')
    ) {
      const item = knowledgeBase.find(i => i.id === 'aeps_banking_safety');
      if (item) return buildResponse(item, queryText, langCode, 1.0);
    }

    const item = knowledgeBase.find(i => i.id === 'digital_banking_safety');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  // 2. Direct Keyword Match across all queries
  if (
    qLower.includes('pm-kisan') || qLower.includes('pm kisan') || qLower.includes('6,000') ||
    qLower.includes('6000') || qLower.includes('৬,০০০') || qLower.includes('୬,୦୦୦') ||
    qLower.includes('किसान') || qLower.includes('రైతు') || qLower.includes('କୃଷକ') ||
    qLower.includes('কৃষক') || qLower.includes('kisan samman')
  ) {
    const item = knowledgeBase.find(i => i.id === 'pm_kisan');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  if (
    qLower.includes('ayushman') || qLower.includes('pmjay') || qLower.includes('pm-jay') ||
    qLower.includes('5 lakh') || qLower.includes('500000') || qLower.includes('hospital') ||
    qLower.includes('आयुष्मान') || qLower.includes('ఆయుష్మాన్') || qLower.includes('ଆୟୁଷ୍ମାନ')
  ) {
    const item = knowledgeBase.find(i => i.id === 'ayushman_bharat');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  if (
    qLower.includes('eklavya') || qLower.includes('emrs') || qLower.includes('scholarship') ||
    qLower.includes('tribal') || qLower.includes('एकलव्य') || qLower.includes('छात्रवृत्ति') ||
    qLower.includes('స్కాలర్‌షిప్') || qLower.includes('ସ୍କଲାରସିପ୍') || qLower.includes('স্কলারশিপ')
  ) {
    const item = knowledgeBase.find(i => i.id === 'tribal_scholarships_emrs');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  if (
    qLower.includes('upi') || qLower.includes('pin') || qLower.includes('scam') ||
    qLower.includes('fraud') || qLower.includes('otp') || qLower.includes('1930') ||
    qLower.includes('पिन') || qLower.includes('फ्रॉड') || qLower.includes('ठगी')
  ) {
    const item = knowledgeBase.find(i => i.id === 'digital_banking_safety');
    if (item) return buildResponse(item, queryText, langCode, 1.0);
  }

  // 3. Score-based matching
  let bestItem = null;
  let bestScore = 0;
  for (const item of knowledgeBase) {
    let score = 0;
    for (const kw of item.keywords || []) {
      const kwLower = kw.toLowerCase();
      if (qLower.includes(kwLower)) score += 5;
    }
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  if (bestItem && bestScore >= 5) {
    return buildResponse(bestItem, queryText, langCode, Math.min(bestScore / 10, 1.0));
  }

  // General fallback
  const fallbackItem = knowledgeBase[0];
  return buildResponse(fallbackItem, queryText, langCode, 0.5);
}

function buildResponse(item, queryText, langCode, confidence) {
  const code = (langCode || 'hi').toLowerCase().trim();
  const answerText = item.answers[code] || item.answers['hi'] || item.answers['en'];
  const actualLang = item.answers[code] ? code : (item.answers['hi'] ? 'hi' : 'en');
  const voiceAvailable = isVoiceSupportedForLang(actualLang);

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
    confidence: confidence
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body?.query : req.query?.query;
  const language = (req.method === 'POST' ? req.body?.language : req.query?.language) || 'hi';
  const category = req.method === 'POST' ? req.body?.category : req.query?.category;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const result = matchLocalQuery(query.trim(), language, category);
  return res.status(200).json(result);
}
