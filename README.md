# स्वर सहायक (SwarSahayak)
### Multilingual Voice-Based Digital Assistant for Rural and Tribal India

[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**SwarSahayak** is a multilingual, voice-first digital assistant engineered to empower rural and tribal communities across India to access verified information on **Government Welfare Schemes**, **Healthcare**, **Education**, and **Safe Banking** regardless of their literacy level or preferred language.

---

## 🌟 Upgraded Capabilities & Highlights

1. **35 Indian Languages & Varieties Across 6 Regions**:
   - **North India**: Hindi, Punjabi, Haryanvi, Bhojpuri, Maithili, Magahi, Awadhi, Braj Bhasha, Bundeli, Rajasthani, Marwari, Dogri, Kashmiri, Urdu, Himachali/Pahari.
   - **Himalayan & Adjoining**: Garhwali, Kumaoni, Ladakhi, Nepali.
   - **East & Northeast**: Odia, Bengali, Assamese, Santali (Ol Chiki), Mundari, Ho, Kui, Manipuri/Meitei, Bodo.
   - **South India**: Telugu, Tamil, Kannada, Malayalam.
   - **West & Central India**: Marathi, Gujarati, Konkani, Chhattisgarhi, Sindhi.
   - **Additional**: English (India), Sanskrit.

2. **Strictly Separated 4 Capabilities**:
   - **Speech Recognition (ASR)**: Microphone voice to text.
   - **Text-to-Speech (TTS)**: Answer text to spoken voice.
   - **Translation**: Dialect translation preserving authentic idioms.
   - **Answer Content**: Curated, verified facts with official government source links.

3. **Multi-Provider Speech Architecture**:
   - **Microsoft Edge Neural TTS**: Studio-grade neural voices for major scheduled languages (`hi`, `en`, `bn`, `te`, `ta`, `mr`, `gu`, `kn`, `ml`, `ur`, `ne`) out-of-the-box with zero API keys.
   - **Verified Native-Speaker Audio Pipeline**: Approved human voice recordings for regional and tribal languages (Bhojpuri, Santali, Mundari, Ho, Kui, Haryanvi, etc.) with speaker and reviewer provenance.
   - **Server gTTS Fallback**: Broad server-side Indian language speech fallback.
   - **Bhashini Adapter**: Production-ready adapter for Government of India's National Language Translation Mission (ULCA / Dhruva).

4. **Mandatory 4 Playback Speeds (`0.5× | 1× | 1.5× | 2×`)**:
   - Default speed: `1×`.
   - Client-side playback rate adjustments with pitch preservation (`preservesPitch = true`).
   - Retained across consecutive answers using `localStorage`.
   - Zero unnecessary re-synthesis calls on speed adjustment.

5. **Complete Playback State Controls**:
   - **Play**, **Pause**, **Resume**, **Replay**, and **Stop** controls.
   - Accessible via keyboard, screen-readers, and touch devices.

---

## 🚀 Quick Start Guide (Windows)

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 1. Start the Backend API (FastAPI)

Open a **PowerShell** window:
```powershell
# Navigate to the backend directory
cd C:\Users\ASUS\OneDrive\Desktop\swarsahayak\backend

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# (Optional) Install dependencies if running for the first time:
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend will start on **`http://localhost:8000`** with interactive Swagger documentation at **`http://localhost:8000/docs`**.

### 2. Start the Frontend (Vite + React)

Open a **second PowerShell** window:
```powershell
# Navigate to the frontend directory
cd C:\Users\ASUS\OneDrive\Desktop\swarsahayak\frontend

# Start the Vite development server
cmd.exe /c "npm run dev"
```
The application will be live at **`http://localhost:5173`**.

---

## 🎧 Demonstration & Testing Walkthrough

1. **Test Spoken Regional Dialects (Bhojpuri / Haryanvi / Rajasthani)**:
   - Click the language selector on the top right.
   - Select **Bhojpuri** (`bho`). Notice the card displays `Recorded Audio & Text`.
   - Click **"Test Voice"** directly inside the card to hear the native greeting!
   - Ask or click **"PM-KISAN"**: The verified answer appears in authentic Bhojpuri (*कइसे मिली*, *खाता में भेजल जाला*), and clicking **"Listen Answer"** plays the verified native speaker recording.

2. **Test Tribal Language (Santali in Ol Chiki)**:
   - Select **Santali** (`sat`).
   - Click **"Test Voice"** to hear authentic Santali speech (*ᱡᱚᱦᱟᱨ! ᱥᱣᱚᱨ ᱥᱚᱦᱟᱭᱚᱠ ᱨᱮ ᱟᱢᱟᱜ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾*).
   - Ask about PM-KISAN to receive verified Ol Chiki text and spoken native audio.

3. **Test 4 Playback Speeds (`0.5× | 1× | 1.5× | 2×`)**:
   - While an answer is speaking, click `0.5×`: The voice slows down for elderly and low-literacy clarity without distortion.
   - Click `1.5×` or `2×`: The voice speeds up smoothly without re-synthesizing.
   - Click **Pause**: Playback pauses mid-sentence.
   - Click **Resume**: Playback resumes from the exact second.

---

## 📂 Repository File Structure

```text
swarsahayak/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entrypoint & CORS middleware
│   │   ├── routes.py                   # REST endpoints (/api/ask, /api/languages, /api/recordings)
│   │   ├── schemas.py                  # Pydantic schemas for languages and speech
│   │   ├── assistant.py                # Retrieval engine with verified answer fallbacks
│   │   ├── language_service.py         # 35-language catalogue loader
│   │   ├── speech/                     # Speech provider architecture
│   │   │   ├── base.py                 # Abstract BaseSpeechProvider interface
│   │   │   ├── edge_tts_adapter.py     # Microsoft Edge Neural TTS provider
│   │   │   ├── gtts_adapter.py         # Server gTTS fallback provider
│   │   │   ├── bhashini_adapter.py     # Government of India Bhashini adapter
│   │   │   ├── recorded_audio_service.py # Native speaker recording manager
│   │   │   ├── provider_factory.py     # Provider router and registry
│   │   │   ├── tts_service.py          # Unified TTS service
│   │   │   ├── asr_service.py          # Unified ASR service
│   │   │   └── service.py              # Central speech manager
│   │   └── data/
│   │       ├── languages.json          # Master 35-language catalogue
│   │       ├── knowledge_base.json     # Curated verified welfare answers
│   │       ├── recordings_manifest.json# Manifest of verified native recordings
│   │       └── recordings/             # MP3 human audio recordings
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── languages.js            # Frontend 35-language catalogue
│   │   │   └── ui_translations.js      # UI localization strings
│   │   ├── services/
│   │   │   ├── audioPlayer.js          # Shared Audio Player (0.5x, 1x, 1.5x, 2x speeds)
│   │   │   ├── speechService.js        # Speech ASR/TTS client orchestration
│   │   │   ├── translationService.js   # Truthful translation helper
│   │   │   ├── api.js                  # Backend API client
│   │   │   └── speech.js               # Browser Web Speech integration
│   │   ├── components/
│   │   │   ├── LanguageSelector.jsx    # Regional tabs, search, test voice buttons
│   │   │   ├── LanguageSelectorModal.jsx # Modal wrapper for language selection
│   │   │   ├── VoiceControls.jsx       # Play, Pause, Resume, Replay, Stop bar
│   │   │   ├── PlaybackSpeedControl.jsx# 0.5x, 1x, 1.5x, 2x accessible pills
│   │   │   ├── AnswerPanel.jsx         # Answer renderer with integrated voice controls
│   │   │   ├── CapabilityMatrixModal.jsx # 35-language audited capability table
│   │   │   └── VoiceMicZone.jsx        # Microphone input with live sound wave
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── docs/
    ├── CAPABILITY_MATRIX.md            # Audited capability table across 35 languages
    └── TEST_RESULTS_AND_LIMITATIONS.md # Verification report and test cases
```
