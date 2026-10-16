import React from 'react';
import { getUIText } from '../config/ui_translations';

export default function Navbar({
  currentLanguage,
  onOpenLanguageModal,
  simplifiedMode,
  onToggleSimplifiedMode,
  onOpenMatrixModal,
  onOpenPrivacyModal,
  backendOnline
}) {
  const ui = (key) => getUIText(currentLanguage.code, key);

  return (
    <header className="navbar-container" role="banner">
      <div className="navbar-content">
        {/* Brand Logo & Name */}
        <div className="brand-section">
          <div className="brand-logo-emblem" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
              <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
            </svg>
          </div>
          <div className="brand-titles">
            <div className="brand-primary-row">
              <h1 className="brand-name">स्वर सहायक</h1>
              <span className="brand-en-badge">SwarSahayak</span>
            </div>
            <p className="brand-tagline">
              {simplifiedMode ? 'सरल आवाज सहायक (Easy Voice Assistant)' : ui('tagline')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="navbar-controls">
          {/* Backend Status indicator */}
          <div
            className={`status-indicator-pill ${backendOnline ? 'online' : 'offline'}`}
            title={backendOnline ? 'Backend API connected' : 'Local offline mode active'}
          >
            <span className="status-dot"></span>
            <span className="status-text">{backendOnline ? 'Online' : 'Local'}</span>
          </div>

          {/* Simplified Mode Button */}
          <button
            id="toggle-simplified-mode"
            className={`control-button mode-toggle-button ${simplifiedMode ? 'active' : ''}`}
            onClick={onToggleSimplifiedMode}
            title="Toggle high-contrast simplified interface for low digital literacy"
            aria-pressed={simplifiedMode}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>{simplifiedMode ? ui('normalMode') : ui('simplifiedMode')}</span>
          </button>

          {/* Language Selector Button */}
          <button
            id="open-language-selector"
            className="control-button language-selector-button"
            onClick={onOpenLanguageModal}
            aria-label={`Current language: ${currentLanguage.name}. Click to change.`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <div className="lang-button-text">
              <span className="lang-native">{currentLanguage.nativeName}</span>
              <span className="lang-code-tag">{currentLanguage.code.toUpperCase()}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Capability Matrix & Privacy links */}
          <button
            id="open-capability-matrix"
            className="control-button icon-only-button"
            onClick={onOpenMatrixModal}
            title={ui('capabilityMatrix')}
            aria-label="View 35-language capability matrix"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </button>

          <button
            id="open-privacy-modal"
            className="control-button icon-only-button"
            onClick={onOpenPrivacyModal}
            title={ui('privacyNotice')}
            aria-label="View privacy notice"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
