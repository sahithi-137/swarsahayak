# SwarSahayak (स्वर सहायक) — Project Comprehensive Report
**Multilingual Voice-Based Digital Assistant for Rural and Tribal India**

---

## 1. Executive Summary

Despite rapid digital expansion through smartphone penetration and UPI adoption across India, millions of citizens residing in rural villages, tribal hamlets, and underserved districts remain functionally excluded from digital public infrastructure. The core barriers are not purely infrastructural; rather, they stem from:
1. **Limited Textual Literacy**: Inability to read dense government portals, legal notifications, and English/formal Hindi terminology.
2. **Linguistic Fragmentation**: India's linguistic diversity encompasses 22 Eighth Schedule languages, massive regional linguistic communities like Bhojpuri (50M+ speakers), and hundreds of indigenous tribal dialects (e.g., Santali, Mundari, Ho, Kui). Most commercial AI solutions cater predominantly to English or urban Hindi speakers, often misclassifying regional languages like Bhojpuri as mere Hindi dialects.
3. **Complex Interfaces**: Conventional multi-tier drop-down menus, CAPTCHAs, and search engines overwhelm first-time digital users.
4. **Fear of Digital Fraud**: Rampant UPI and biometric fraud causes rural citizens to either avoid digital services or fall prey to exploitative middlemen.

**SwarSahayak** addresses this crisis with a **functional, voice-first, accessible digital assistant**. Supporting 17 configured Indian languages (12 Scheduled, 1 Regional [Bhojpuri], and 4 Tribal), it enables rural and tribal citizens to interact naturally in their mother tongue, ask about critical government benefits, healthcare resources, educational scholarships, and safe banking practices, and receive verified, plain-language answers accompanied by authoritative official links.

---

## 2. Target Beneficiaries & User Personas

### Persona A: Somra Murmu (Age 48, Santhal Farmer, Mayurbhanj District, Odisha)
- **Language**: Santali (Ol Chiki script) and Odia.
- **Literacy**: Limited formal education; comfortable with spoken voice.
- **Pain Point**: Struggles to check eligibility for the PM-KISAN ₹6,000 installment and Van Dhan forest produce support; currently pays ₹150 to a local cyber-café middleman.
- **SwarSahayak Benefit**: Speaks his query or selects a high-contrast card; receives an honest, localized Santali explanation of the required land documents and free registration process.

### Persona B: Shanti Devi (Age 62, MGNREGA Worker, Gaya District, Bihar)
- **Language**: Rural Hindi / Magahi.
- **Digital Literacy**: Smartphone newcomer; relies on voice notes.
- **Pain Point**: Terrified of digital banking scams and unaware of how the Ayushman Bharat ₹5 Lakh health insurance works for her senior citizen family members.
- **SwarSahayak Benefit**: Activates **Simplified Mode (सरल मोड)**; one tap opens spoken audio on safe UPI rules ("PIN is only for sending money, never receiving") and emergency ambulance helplines (108).

### Persona C: Radheshyam Yadav (Age 52, Smallholder Farmer, Buxar District, Bihar)
- **Language**: Bhojpuri (भोजपुरी).
- **Digital Literacy**: Basic phone user; finds urban Hindi government websites confusing and dismissive of Bhojpuri phrasing.
- **Pain Point**: Wants to know when the next PM-KISAN installment will arrive in his bank account (*"हमार खाता में कइया ले आई?"*), without having his dialect converted into standard bureaucratic Hindi.
- **SwarSahayak Benefit**: Types or selects Bhojpuri prompts; receives answers in natural, authentic Bhojpuri (*"हर चार महीना पर ₹2,000-₹2,000 कइके सीधे बैंक खाता में भेजल जाला"*); system never silently translates his language to Hindi and transparently enables Manual Reading Mode while voice models are in research pilot.

---

## 3. Four Core Essential Assistance Domains

| Service Category | Primary Inquiries Handled | Official Authority Verified |
|---|---|---|
| **Government Schemes** | PM-KISAN (₹6,000 income support), PMAY-Gramin (pucca housing grants), PM Matru Vandana Yojana (maternity support), Van Dhan Vikas Yojana (tribal MFP MSP) | Ministry of Agriculture, Ministry of Rural Development, TRIFED |
| **Healthcare** | Ayushman Bharat PM-JAY (₹5 lakh cashless cover), 108 Emergency Ambulance, 102 Mother & Child transport, eSanjeevani Teleconsultation, TB Nikshay Poshan | National Health Authority (NHA), Ministry of Health & Family Welfare |
| **Education** | Pre/Post-Matric ST Scholarships, Eklavya Model Residential Schools (EMRS), PM eVidya / DIKSHA free regional textbooks | Ministry of Tribal Affairs, National Scholarship Portal (NSP), NCERT |
| **Safe Banking** | UPI PIN fraud alerts, OTP confidentiality, AEPS Biometric safety at CSP/Bank Mitra counters, Cyber Crime 1930 reporting | Reserve Bank of India (RBI Kehta Hai), National Payments Corporation of India (NPCI) |

---

## 4. Technical Architecture & Design Decisions

### A. Frontend Architecture
- **Framework**: React 18 with Vite for lightning-fast bundling (<500ms build time).
- **Styling**: Tailored Vanilla CSS utilizing an earthy, trustworthy palette of **Forest Green (`#1b4332`)**, **Sage (`#52b788`)**, and **Warm Cream (`#f7f5f0`)**.
- **Accessibility & Simplified Mode**:
  - Minimum touch target sizing of 52px–64px.
  - One-tap toggle for **Simplified Mode** featuring enlarged typography (18px+), high-contrast borders, and automated audio readout upon answer arrival.
  - Adjustable speech playback rates (0.8x for elder clarity, 1.0x, 1.2x).

### B. Backend Architecture
- **Framework**: Python 3.13 with FastAPI and Uvicorn.
- **Validation**: Strict Pydantic schemas validating all incoming queries, language codes, and response payloads.
- **Provider-Independent Speech Service**:
  - Decoupled `BaseSpeechProvider` abstract interface.
  - Zero mandatory paid APIs: operates out-of-the-box via browser Web Speech API and backend `gTTS` fallback.
  - Pre-engineered for Government of India's **Bhashini (National Language Translation Mission)** Dhruva inference endpoints.

### C. Knowledge Retrieval Pipeline
- Curated, verified JSON knowledge repository with zero synthetic hallucinations.
- Multi-token semantic overlap matching across transliterated and native script terms.
- Healthcare and banking safety disclaimers automatically attached to all relevant answers.

---

## 5. Ethical AI & Linguistic Authenticity

A critical innovation of SwarSahayak is **Phonetic and Linguistic Honesty**:
1. **Never Faking Pronunciation**: Standard browser speech engines do not possess acoustic models for tribal languages such as Santali, Mundari, Ho, or Kui, nor dedicated models for Bhojpuri. Many existing apps force an English or Hindi speech engine to read these languages phonetically, producing offensive or unintelligible noise. SwarSahayak explicitly disallows this, switching to verified manual reading mode with an honest advisory note.
2. **Never Treating Bhojpuri as Merely Accented Hindi**: Bhojpuri is an independent language with over 50 million speakers, distinct verb conjugation rules, and unique vocabulary. SwarSahayak never treats Bhojpuri as broken Hindi or a regional accent.
3. **Never Silently Converting Bhojpuri to Hindi**: When a user inputs a query in Bhojpuri or selects Bhojpuri as their interface language, SwarSahayak strictly maintains Bhojpuri text in both queries and answers. It refuses to convert inquiries or responses into Hindi behind the scenes.
4. **Testing Voice Models with Actual Speakers**: Direct voice recognition or spoken output in Bhojpuri will only be advertised after formal field testing and acoustic WER verification with native Bhojpuri speakers across Bihar and Purvanchal.
5. **Never Silently Falling Back to English**: When a user selects their mother tongue, their choice is respected throughout the interface.
6. **Zero Credential Collection**: To protect vulnerable rural populations from spear-phishing, SwarSahayak never collects Aadhaar numbers, biometric fingerprints, OTPs, or banking PINs.

---

## 6. Conclusion & Roadmap

SwarSahayak demonstrates that digital empowerment for rural and tribal India requires human-centric, multilingual, voice-first software engineering. By October 31, 2026, the project will expand field pilot testing with community health workers (ASHAs), Gram Panchayats, and Common Service Centres (CSCs).
