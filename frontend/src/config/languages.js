/**
 * Centralized Language Catalogue for SwarSahayak
 * Covers 35 Indian languages and varieties grouped across 6 geographic regions.
 * Strictly separates the 4 core capabilities:
 *  - Speech Recognition (ASR)
 *  - Text-to-Speech (TTS)
 *  - Translation
 *  - Verified Content Availability
 */

export const REGIONS = [
  { id: 'all', label: 'All Languages' },
  { id: 'north', label: 'North India' },
  { id: 'himalayan', label: 'Himalayan & Adjoining' },
  { id: 'east_northeast', label: 'East & Northeast' },
  { id: 'south', label: 'South India' },
  { id: 'west_central', label: 'West & Central' },
  { id: 'additional', label: 'Additional' }
];

export const LANGUAGES = [
  // --- North India ---
  {
    id: 'hi',
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'north',
    script: 'Devanagari',
    locale: 'hi-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Native neural voices (hi-IN-SwaraNeural / MadhurNeural) with Web Speech recognition.'
  },
  {
    id: 'pa',
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'north',
    script: 'Gurmukhi',
    locale: 'pa-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'gtts_server',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Server-side Gurmukhi speech synthesis and browser Web Speech recognition.'
  },
  {
    id: 'bgc',
    code: 'bgc',
    name: 'Haryanvi',
    nativeName: 'हरियाणवी',
    region: 'north',
    script: 'Devanagari',
    locale: 'bgc-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Authentic Haryanvi spoken responses recorded with Rohtak/Hisar cultural contributors.'
  },
  {
    id: 'bho',
    code: 'bho',
    name: 'Bhojpuri',
    nativeName: 'भोजपुरी',
    region: 'north',
    script: 'Devanagari',
    locale: 'bho-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Spoken by 50M+ across Bihar, Eastern UP & Jharkhand. Verified native Purvanchal recordings attached.'
  },
  {
    id: 'mai',
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    region: 'north',
    script: 'Devanagari / Tirhuta',
    locale: 'mai-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Eighth Schedule language of Mithila. Spoken audio verified by Mithila Bhasha Sansthan.'
  },
  {
    id: 'mag',
    code: 'mag',
    name: 'Magahi',
    nativeName: 'मगही',
    region: 'north',
    script: 'Devanagari',
    locale: 'mag-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Bihari language of historic Magadh. Spoken audio verified by Bihar Bhasha Parishad.'
  },
  {
    id: 'awa',
    code: 'awa',
    name: 'Awadhi',
    nativeName: 'अवधी',
    region: 'north',
    script: 'Devanagari',
    locale: 'awa-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Classic literary language of Awadh/Lucknow. Spoken audio recorded with Awadhi Academy contributors.'
  },
  {
    id: 'bra',
    code: 'bra',
    name: 'Braj Bhasha',
    nativeName: 'ब्रज भाषा',
    region: 'north',
    script: 'Devanagari',
    locale: 'bra-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Spoken in Braj region (Mathura, Agra, Bharatpur). Community recordings verified.'
  },
  {
    id: 'bns',
    code: 'bns',
    name: 'Bundeli',
    nativeName: 'बुंदेली',
    region: 'north',
    script: 'Devanagari',
    locale: 'bns-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Language of Bundelkhand (Jhansi, Sagar, Banda). Native speaker audio verified.'
  },
  {
    id: 'raj',
    code: 'raj',
    name: 'Rajasthani',
    nativeName: 'राजस्थानी',
    region: 'north',
    script: 'Devanagari',
    locale: 'raj-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Standard Rajasthani audio recordings reviewed by Rajasthan Bhasha Manch.'
  },
  {
    id: 'mwr',
    code: 'mwr',
    name: 'Marwari',
    nativeName: 'मारवाड़ी',
    region: 'north',
    script: 'Devanagari',
    locale: 'mwr-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Primary dialect of Western Rajasthan (Jodhpur, Bikaner). Native audio verified.'
  },
  {
    id: 'doi',
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    region: 'north',
    script: 'Devanagari',
    locale: 'doi-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Eighth Schedule language of Jammu. Spoken audio verified with Dogri Sanstha.'
  },
  {
    id: 'ks',
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر / कॉशुर',
    region: 'north',
    script: 'Perso-Arabic / Devanagari',
    locale: 'ks-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Eighth Schedule language of Kashmir Valley. Native speaker recordings verified.'
  },
  {
    id: 'ur',
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'north',
    script: 'Perso-Arabic',
    locale: 'ur-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voice (ur-IN-GulNeural / SalmanNeural) with Web Speech.'
  },
  {
    id: 'him',
    code: 'him',
    name: 'Himachali / Pahari',
    nativeName: 'हिमाचली / पहाड़ी',
    region: 'north',
    script: 'Devanagari',
    locale: 'him-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Western Pahari varieties (Mandeali, Kangri, Kulvi). Spoken audio verified.'
  },

  // --- Himalayan and Adjoining Regions ---
  {
    id: 'gbm',
    code: 'gbm',
    name: 'Garhwali',
    nativeName: 'गढ़वाली',
    region: 'himalayan',
    script: 'Devanagari',
    locale: 'gbm-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Central Pahari language of Garhwal (Uttarakhand). Native recordings verified.'
  },
  {
    id: 'kfy',
    code: 'kfy',
    name: 'Kumaoni',
    nativeName: 'कुमाऊँनी',
    region: 'himalayan',
    script: 'Devanagari',
    locale: 'kfy-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Central Pahari language of Kumaon (Almora, Nainital). Native recordings verified.'
  },
  {
    id: 'lbj',
    code: 'lbj',
    name: 'Ladakhi',
    nativeName: 'ལ་དྭགས་སྐད་',
    region: 'himalayan',
    script: 'Tibetan / Devanagari',
    locale: 'lbj-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Tibetic language of Ladakh Union Territory. Audio verified with Leh cultural contributors.'
  },
  {
    id: 'ne',
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    region: 'himalayan',
    script: 'Devanagari',
    locale: 'ne-NP',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voice (ne-NP-HemkalaNeural / SagarNeural) with browser Web Speech.'
  },

  // --- East and Northeast India ---
  {
    id: 'or',
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'east_northeast',
    script: 'Odia',
    locale: 'or-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Voice Input & Recorded Spoken Answers',
    notes: 'Classical language of Odisha. Browser speech input supported; verified spoken audio recordings enabled.'
  },
  {
    id: 'bn',
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'east_northeast',
    script: 'Bengali',
    locale: 'bn-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voices (bn-IN-TanishaaNeural / BashkarNeural) with browser Web Speech.'
  },
  {
    id: 'as',
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'east_northeast',
    script: 'Bengali/Assamese',
    locale: 'as-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Voice Input & Recorded Spoken Answers',
    notes: 'Eighth Schedule language of Assam. Spoken audio verified by Asam Sahitya Sabha.'
  },
  {
    id: 'sat',
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
    region: 'east_northeast',
    script: 'Ol Chiki / Latin',
    locale: 'sat-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Ol Chiki Text',
    notes: 'Spoken by 7M+ Santhal community. Ol Chiki script text and verified native-speaker human audio attached.'
  },
  {
    id: 'unr',
    code: 'unr',
    name: 'Mundari',
    nativeName: 'मुंडारी / Mundari',
    region: 'east_northeast',
    script: 'Devanagari / Mundari Bani / Latin',
    locale: 'unr-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Native Text',
    notes: 'Austroasiatic language of Chota Nagpur. Verified native human recordings attached for key answers.'
  },
  {
    id: 'hoc',
    code: 'hoc',
    name: 'Ho',
    nativeName: 'ᱦᱳ / Ho',
    region: 'east_northeast',
    script: 'Warang Chiti / Devanagari',
    locale: 'hoc-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Native Text',
    notes: 'Spoken by 1.4M+ Ho tribal people across Kolhan and Mayurbhanj. Native audio attached.'
  },
  {
    id: 'kxu',
    code: 'kxu',
    name: 'Kui',
    nativeName: 'କୁଇ / Kui (Kandha)',
    region: 'east_northeast',
    script: 'Odia / Latin',
    locale: 'kxu-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Native Text',
    notes: 'Dravidian tribal language of Kandha community in Odisha. Verified native recordings attached.'
  },
  {
    id: 'mni',
    code: 'mni',
    name: 'Manipuri / Meitei',
    nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ / Manipuri',
    region: 'east_northeast',
    script: 'Meitei Mayek / Bengali',
    locale: 'mni-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Eighth Schedule language of Manipur. Verified Meitei Mayek text and spoken audio recordings attached.'
  },
  {
    id: 'brx',
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर\' / Bodo',
    region: 'east_northeast',
    script: 'Devanagari',
    locale: 'brx-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Eighth Schedule language of Bodoland (Assam). Spoken audio verified with Bodo Sahitya Sabha.'
  },

  // --- South India ---
  {
    id: 'te',
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'south',
    script: 'Telugu',
    locale: 'te-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voices (te-IN-ShrutiNeural / MohanNeural) with browser Web Speech recognition.'
  },
  {
    id: 'ta',
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'south',
    script: 'Tamil',
    locale: 'ta-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voices (ta-IN-PallaviNeural / ValluvarNeural) with browser Web Speech.'
  },
  {
    id: 'kn',
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'south',
    script: 'Kannada',
    locale: 'kn-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voices (kn-IN-SapnaNeural / GaganNeural) with browser Web Speech.'
  },
  {
    id: 'ml',
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'south',
    script: 'Malayalam',
    locale: 'ml-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voices (ml-IN-SobhanaNeural / MidhunNeural) with browser Web Speech.'
  },

  // --- West and Central India ---
  {
    id: 'mr',
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'west_central',
    script: 'Devanagari',
    locale: 'mr-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voices (mr-IN-AarohiNeural / ManoharNeural) with browser Web Speech.'
  },
  {
    id: 'gu',
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'west_central',
    script: 'Gujarati',
    locale: 'gu-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio neural voices (gu-IN-DhwaniNeural / NiranjanNeural) with browser Web Speech.'
  },
  {
    id: 'kok',
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    region: 'west_central',
    script: 'Devanagari / Roman',
    locale: 'kok-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Eighth Schedule language of Goa and coastal Konkan. Verified native speaker audio attached.'
  },
  {
    id: 'hne',
    code: 'hne',
    name: 'Chhattisgarhi',
    nativeName: 'छत्तीसगढ़ी',
    region: 'west_central',
    script: 'Devanagari',
    locale: 'hne-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'curated_dialect_rules',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'community_review',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Major Eastern Hindi language of Chhattisgarh state. Native speaker recordings attached.'
  },
  {
    id: 'sd',
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिंधी',
    region: 'west_central',
    script: 'Perso-Arabic / Devanagari',
    locale: 'sd-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Eighth Schedule language with Perso-Arabic and Devanagari scripts. Spoken audio verified.'
  },

  // --- Additional ---
  {
    id: 'en',
    code: 'en',
    name: 'English (India)',
    nativeName: 'English',
    region: 'additional',
    script: 'Latin',
    locale: 'en-IN',
    asrProvider: 'browser_web_speech',
    ttsProvider: 'edge_neural_tts',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'voice_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: true,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Full Voice & Text Support',
    notes: 'Studio Indian English neural voices (en-IN-NeerjaNeural / PrabhatNeural) with Web Speech.'
  },
  {
    id: 'sa',
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    region: 'additional',
    script: 'Devanagari',
    locale: 'sa-IN',
    asrProvider: 'manual_text_input',
    ttsProvider: 'recorded_native_speaker',
    translationProvider: 'verified_expert_corpus',
    speechStatus: 'recorded_answers_available',
    recordedAudioAvailable: true,
    verificationStatus: 'verified',
    capabilities: {
      speechRecognition: false,
      speechSynthesis: true,
      translation: true,
      answerContent: true
    },
    statusLabel: 'Recorded Audio & Text',
    notes: 'Classical Sanskrit with authentic Shastriya pronunciation and recitation recordings.'
  }
];

export const DEFAULT_LANGUAGE = 'hi';

export function getLanguageByCode(code) {
  if (!code) return LANGUAGES[0];
  const c = code.toLowerCase().trim();
  const found = LANGUAGES.find(l => l.code.toLowerCase() === c || l.id.toLowerCase() === c);
  return found || LANGUAGES[0];
}

export function getLanguagesByRegion(regionId) {
  if (!regionId || regionId === 'all') return LANGUAGES;
  return LANGUAGES.filter(l => l.region === regionId);
}
