import React from 'react';
import LanguageSelector from './LanguageSelector';
import { LANGUAGES } from '../config/languages';
import { getUIText } from '../config/ui_translations';

export default function LanguageSelectorModal({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) {
  if (!isOpen) return null;

  const ui = (key) => getUIText(currentLanguage.code, key);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
    >
      <div
        className="modal-content language-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="lang-modal-title" className="modal-title">
              {ui('selectLanguage')} ({LANGUAGES.length} Languages & Varieties)
            </h2>
            <p className="modal-subtitle">
              SwarSahayak respects your linguistic identity. Filter by region, search by script, or test spoken voices.
            </p>
          </div>
          <button
            id="close-language-modal"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close language selector modal"
          >
            ✕
          </button>
        </div>

        {/* Upgraded Multi-Regional Language Selector */}
        <LanguageSelector
          currentLanguage={currentLanguage}
          onSelectLanguage={onSelectLanguage}
          onClose={onClose}
          uiLabels={{
            selectLanguage: ui('selectLanguage')
          }}
        />

        {/* Modal Footer Note */}
        <div className="modal-footer-note">
          <div className="truth-disclosure-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              <strong>Linguistic Honesty Guarantee:</strong> For languages with automated neural TTS (Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Urdu, Nepali), studio-quality speech is generated.
              For regional and tribal languages (Bhojpuri, Santali, Mundari, Ho, Kui, etc.), approved native-speaker human audio recordings are attached directly rather than faking speech.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
