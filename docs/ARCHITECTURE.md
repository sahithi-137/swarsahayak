# SwarSahayak (स्वर सहायक) — System Architecture

**SwarSahayak** is a multilingual, voice-first digital assistant architected specifically for rural and tribal citizens of India. It bridges the digital literacy divide by allowing users to interact naturally in their mother tongue through spoken voice or native script, returning verified public welfare, healthcare, education, and safe banking information.

---

## 1. High-Level Architectural Diagram

```mermaid
graph TD
    subgraph Client ["Client Layer (React + Vite PWA)"]
        UI["Accessible Mobile-First UI\n(Forest Green / Sage / Cream)"]
        Mic["VoiceMicZone\n(Web Speech API Recognition)"]
        TTSClient["Audio Player & Synthesis\n(HTML5 Audio / Web Speech API)"]
        LangPicker["Centralized Language Selector\n(17 Languages + Capability Matrix)"]
        EasyMode["Simplified Interface Mode\n(Large Touch Targets & Voice-First)"]
    end

    subgraph Gateway ["Network & Security Boundary"]
        CORS["CORS Policy & Validation"]
        Env[".env Configuration & Secrets Isolation"]
    end

    subgraph Backend ["Application Backend (FastAPI + Python 3.13)"]
        Router["REST API Router (/api/*)"]
        LangService["Language Service\n(Capability Matrix & Locale Metadata)"]
        Engine["Assistant Engine\n(Semantic & Token Keyword Matcher)"]
        
        subgraph SpeechLayer ["Provider-Independent Speech Layer"]
            SpeechManager["Speech Manager Orchestrator"]
            GTTS["gTTS Server-Side Adapter"]
            Bhashini["Bhashini (Dhruva) Adapter\n(Pilot / Extensible)"]
            ReadingMode["Phonetic Reading Mode\n(Tribal & Regional Integrity Protection)"]
        end
    end

    subgraph DataStore ["Verified Knowledge & Data Layer"]
        KB[("Curated Knowledge Base JSON\n- Govt Schemes\n- Healthcare\n- Education\n- Safe Banking")]
        OfficialSources[("Official Verified Sources\n- pmkisan.gov.in\n- pmjay.gov.in\n- scholarships.gov.in\n- cybercrime.gov.in")]
    end

    Mic -->|Audio Transcript / Text Query| Router
    LangPicker -->|Locale & Script Selection| LangService
    Router --> Engine
    Engine --> KB
    Engine --> SpeechManager
    SpeechManager --> GTTS
    SpeechManager --> Bhashini
    SpeechManager --> ReadingMode
    Router -->|JSON Response + Verified Sources + Audio Base64| TTSClient
    UI --> Mic
    UI --> EasyMode
```

---

## 2. Sequence Diagram: Voice Question & Answer Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as Rural/Tribal Citizen
    participant Mic as VoiceMicZone
    participant WebSpeech as Web Speech Engine
    participant React as React Frontend
    participant API as FastAPI Backend (/api/ask)
    participant Engine as Assistant Engine
    participant Speech as Speech Manager
    participant Speaker as Audio Output

    User->>Mic: Tap Microphone Button
    Mic->>WebSpeech: Request Mic & Start Recognition (locale: hi-IN, te-IN, etc.)
    User->>Mic: Speaks query in native language
    WebSpeech-->>Mic: Streams interim & final transcript
    Mic-->>User: Displays editable transcript preview
    User->>React: Confirms / Submits Query
    React->>API: POST /api/ask { query, language, category }
    API->>Engine: Match query against verified knowledge base
    Engine->>Engine: Multi-token match & filter by category
    Engine->>Speech: Check Speech Synthesis availability
    alt Supported TTS Language (e.g., hi, bn, te, mr, etc.)
        Speech->>Speech: Generate server-side audio (gTTS/Bhashini)
        Speech-->>Engine: Audio Base64 + Provider status
    else Regional Pilot / Tribal Language (e.g., bho, sat, unr, hoc, kxu)
        Speech-->>Engine: audio_available=False, mode="manual_reading_mode"
    end
    API-->>React: Return localized answer, source URLs, verification date, audio payload
    React->>React: Render Answer Card with Verified Source badge
    alt Audio Available
        React->>Speaker: Play spoken answer (Adjustable speed: 0.8x, 1.0x, 1.2x)
        Speaker-->>User: Clear voice explanation
    else Manual Reading Mode
        React-->>User: Render verified native script (e.g., Bhojpuri / Ol Chiki) with explicit notice
    end
```

---

## 3. Provider-Independent Speech Architecture

The speech layer is decoupled using an abstract interface (`BaseSpeechProvider`). This guarantees that:
1. The frontend never couples directly to a specific commercial speech vendor.
2. The system seamlessly runs out-of-the-box on Windows laptops using free local adapters (`gTTS` + Browser Web Speech API) with zero mandatory paid API keys.
3. When Bhashini API keys (`BHASHINI_API_KEY`, `BHASHINI_USER_ID`) are placed into `.env`, the system automatically switches to Bhashini without changing frontend code.
4. **Phonetic & Linguistic Truthfulness**: If an engine cannot reliably speak a tribal or regional language (e.g., Bhojpuri, Santali, Mundari, Ho, Kui), the engine *never* falsely attempts English or Hindi phonetic approximations. For Bhojpuri, speech synthesis and recognition are disabled rather than substituting Hindi, protecting native phrasing and grammar until authenticated models are tested with native speakers. It explicitly switches to verified reading mode.

---

## 4. Security & Privacy Architecture

- **Zero Credential Collection**: No user authentication, Aadhaar number, banking password, ATM PIN, or OTP is ever requested or accepted.
- **No Raw Voice Retention**: Microphone audio streams are processed in memory and discarded immediately upon transcription. No biometric voiceprints are retained.
- **Source Verification**: All welfare data is linked to authoritative government portals with verification timestamps.
