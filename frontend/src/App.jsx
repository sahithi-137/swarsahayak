import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VoiceMicZone from './components/VoiceMicZone';
import ServiceCards from './components/ServiceCards';
import AnswerPanel from './components/AnswerPanel';
import QuickPrompts from './components/QuickPrompts';
import LanguageSelectorModal from './components/LanguageSelectorModal';
import CapabilityMatrixModal from './components/CapabilityMatrixModal';
import PrivacyNoticeModal from './components/PrivacyNoticeModal';
import { LANGUAGES, DEFAULT_LANGUAGE, getLanguageByCode } from './config/languages';
import { getUIText } from './config/ui_translations';
import { askAssistant, checkBackendHealth } from './services/api';
import { matchLocalQuery } from './services/localAssistant';
import './App.css';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('swarsahayak_lang');
    return saved ? getLanguageByCode(saved) : getLanguageByCode(DEFAULT_LANGUAGE);
  });
  const [simplifiedMode, setSimplifiedMode] = useState(() => {
    return localStorage.getItem('swarsahayak_easy_mode') === 'true';
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answerData, setAnswerData] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState('');

  // Modals
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const ui = (key) => getUIText(currentLanguage.code, key);

  // Check backend health
  useEffect(() => {
    const verifyHealth = async () => {
      const res = await checkBackendHealth();
      setBackendOnline(res && res.status === 'healthy');
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectLanguage = (newLang) => {
    setCurrentLanguage(newLang);
    localStorage.setItem('swarsahayak_lang', newLang.code);

    // If an answer was already displayed, refresh it in the new language seamlessly!
    if (answerData && answerData.query) {
      handleQuerySubmit(answerData.query, newLang.code);
    }
  };

  const handleToggleSimplifiedMode = () => {
    setSimplifiedMode((prev) => {
      const next = !prev;
      localStorage.setItem('swarsahayak_easy_mode', next.toString());
      return next;
    });
  };

  const handleQuerySubmit = async (queryText, targetLangCode = null) => {
    if (!queryText || !queryText.trim()) return;

    setIsProcessing(true);
    const lang = targetLangCode || currentLanguage.code;

    try {
      const result = await askAssistant(queryText.trim(), lang, selectedCategory);
      setAnswerData(result);
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      const fallbackResult = matchLocalQuery(queryText.trim(), lang, selectedCategory);
      setAnswerData(fallbackResult);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`app-root ${simplifiedMode ? 'simplified-theme' : 'standard-theme'}`}>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>

      {/* Top Navigation */}
      <Navbar
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        simplifiedMode={simplifiedMode}
        onToggleSimplifiedMode={handleToggleSimplifiedMode}
        onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        backendOnline={backendOnline}
      />

      {/* Main Container */}
      <main id="main-content" className="app-main-content">
        {/* Welcome Hero Banner */}
        <section className="hero-banner-section" aria-label="Welcome banner">
          <div className="hero-welcome-badge">
            <span className="sparkle-icon">✨</span>
            <span>{currentLanguage.nativeName} ({currentLanguage.name})</span>
            {currentLanguage.category === 'tribal' && (
              <span className="tribal-badge-pill">🌿 Tribal Language</span>
            )}
          </div>
          <h2 className="hero-main-title">
            {simplifiedMode ? 'बोलकर पूछें (Speak to Ask)' : ui('welcome')}
          </h2>

          {/* Emergency Alert Ribbon */}
          <div className="emergency-ribbon" role="complementary">
            <div className="ribbon-item">
              <span className="ribbon-num">🚨 108</span>
              <span className="ribbon-desc">Ambulance</span>
            </div>
            <div className="ribbon-item">
              <span className="ribbon-num">🛡️ 1930</span>
              <span className="ribbon-desc">Cyber Fraud</span>
            </div>
            <div className="ribbon-item">
              <span className="ribbon-num">🤱 102</span>
              <span className="ribbon-desc">Mother & Child</span>
            </div>
            <div className="ribbon-item">
              <span className="ribbon-num">🌾 PM-KISAN</span>
              <span className="ribbon-desc">₹6,000 / Year</span>
            </div>
          </div>
        </section>

        {/* Voice Microphone & Query Input Zone */}
        <VoiceMicZone
          currentLanguage={currentLanguage}
          simplifiedMode={simplifiedMode}
          onSubmitQuery={(q) => handleQuerySubmit(q)}
          isProcessing={isProcessing}
          externalQuery={externalPrompt}
          onClearExternalQuery={() => setExternalPrompt('')}
        />

        {/* Quick Suggested Queries */}
        <QuickPrompts
          currentLanguage={currentLanguage}
          onSelectPrompt={(text) => handleQuerySubmit(text)}
          simplifiedMode={simplifiedMode}
        />

        {/* Answer Display Panel (if answer exists) */}
        {answerData && (
          <section className="answer-section-anchor">
            <AnswerPanel
              answerData={answerData}
              currentLanguage={currentLanguage}
              simplifiedMode={simplifiedMode}
              onAskAgain={() => handleQuerySubmit(answerData.query)}
            />
          </section>
        )}

        {/* 4 Core Essential Service Cards */}
        <ServiceCards
          currentLanguage={currentLanguage}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onTriggerQuickPrompt={(query) => handleQuerySubmit(query)}
          simplifiedMode={simplifiedMode}
        />
      </main>

      {/* Accessible Footer */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>स्वर सहायक (SwarSahayak)</strong> — Multilingual Voice-Based Digital Assistant for Rural & Tribal India.
          </div>
          <div className="footer-meta-links">
            <button className="footer-link-btn" onClick={() => setIsMatrixModalOpen(true)}>
              Capability Matrix ({LANGUAGES.length} Languages)
            </button>
            <span className="sep">•</span>
            <button className="footer-link-btn" onClick={() => setIsPrivacyModalOpen(true)}>
              Privacy Notice
            </button>
            <span className="sep">•</span>
            <span className="footer-date">Verified October 2026</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      <CapabilityMatrixModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
