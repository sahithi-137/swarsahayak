import React, { useState, useEffect } from 'react';
import { speechController, isSpeechRecognitionSupported } from '../services/speech';
import { getUIText } from '../config/ui_translations';

export default function VoiceMicZone({
  currentLanguage,
  simplifiedMode,
  onSubmitQuery,
  isProcessing,
  externalQuery,
  onClearExternalQuery
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isManualInputMode, setIsManualInputMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [listeningDuration, setListeningDuration] = useState(0);

  const ui = (key) => getUIText(currentLanguage.code, key);
  const speechSupported = currentLanguage.capabilities.speechRecognition && isSpeechRecognitionSupported();

  // If parent sends an external query (e.g. from quick prompts or service cards)
  useEffect(() => {
    if (externalQuery) {
      setTextInput(externalQuery);
      setTranscript(externalQuery);
      setIsManualInputMode(true);
      if (onClearExternalQuery) onClearExternalQuery();
    }
  }, [externalQuery]);

  // Listening timer
  useEffect(() => {
    let timer = null;
    if (isListening) {
      setListeningDuration(0);
      timer = setInterval(() => {
        setListeningDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setListeningDuration(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening]);

  // Stop listening when language changes
  useEffect(() => {
    if (isListening) {
      speechController.stopListening();
      setIsListening(false);
    }
    setErrorMessage(null);
  }, [currentLanguage.code]);

  const handleToggleMic = () => {
    setErrorMessage(null);

    if (isListening) {
      speechController.stopListening();
      setIsListening(false);
      return;
    }

    if (!currentLanguage.capabilities.speechRecognition) {
      setErrorMessage(
        `Speech recognition is not currently available for ${currentLanguage.name} (${currentLanguage.nativeName}). Please use the text input below.`
      );
      setIsManualInputMode(true);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setErrorMessage(
        'Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge, or type your question below.'
      );
      setIsManualInputMode(true);
      return;
    }

    const started = speechController.startListening({
      locale: currentLanguage.locale,
      onResult: (interim, final) => {
        const text = final || interim;
        setTranscript(text);
        setTextInput(text);
      },
      onError: (msg) => {
        setIsListening(false);
        setErrorMessage(msg);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (started) {
      setIsListening(true);
    }
  };

  const handleManualSubmit = (e) => {
    if (e) e.preventDefault();
    const query = textInput.trim() || transcript.trim();
    if (!query) return;

    if (isListening) {
      speechController.stopListening();
      setIsListening(false);
    }

    onSubmitQuery(query);
  };

  const handleClear = () => {
    setTranscript('');
    setTextInput('');
    setErrorMessage(null);
    if (isListening) {
      speechController.stopListening();
      setIsListening(false);
    }
  };

  return (
    <section className={`voice-mic-zone ${simplifiedMode ? 'simplified-layout' : ''}`} aria-label="Voice question input">
      {/* Listening Wave & State Indicator */}
      <div className="mic-interactive-center">
        <div className="mic-button-wrapper">
          {/* Animated pulse rings when listening */}
          {isListening && (
            <>
              <div className="pulse-ring ring-1"></div>
              <div className="pulse-ring ring-2"></div>
              <div className="pulse-ring ring-3"></div>
            </>
          )}

          <button
            id="voice-mic-button"
            className={`main-mic-button ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
            onClick={handleToggleMic}
            disabled={isProcessing}
            aria-label={isListening ? ui('stopListening') : ui('pressMicToSpeak')}
            title={isListening ? ui('stopListening') : ui('pressMicToSpeak')}
          >
            {isProcessing ? (
              <div className="mic-spinner" aria-hidden="true"></div>
            ) : isListening ? (
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect width="14" height="14" x="5" y="5" rx="2" fill="currentColor" />
              </svg>
            ) : (
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            )}
          </button>
        </div>

        {/* Live Audio Status Message */}
        <div className="mic-status-label-wrap">
          {isListening ? (
            <div className="listening-badge">
              <span className="live-red-dot"></span>
              <span className="listening-text">{ui('listening')} ({listeningDuration}s)</span>
            </div>
          ) : isProcessing ? (
            <div className="processing-badge">
              <span className="spin-dot"></span>
              <span>{ui('processing')}</span>
            </div>
          ) : (
            <p className="mic-idle-instruction">
              {speechSupported ? ui('pressMicToSpeak') : 'Type below (Voice Pilot for ' + currentLanguage.name + ')'}
            </p>
          )}

          {/* Active Locale Tag */}
          <div className="active-locale-indicator">
            <span>Locale: <strong>{currentLanguage.locale}</strong> ({currentLanguage.nativeName})</span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner if any */}
      {errorMessage && (
        <div className="mic-error-banner" role="alert">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{errorMessage}</div>
          <button className="error-dismiss" onClick={() => setErrorMessage(null)}>✕</button>
        </div>
      )}

      {/* Recognized Text / Manual Editing Box */}
      <form className="query-box-form" onSubmit={handleManualSubmit}>
        <div className="input-group-card">
          <textarea
            id="user-query-input"
            className="user-query-textarea"
            rows={simplifiedMode ? 2 : 3}
            placeholder={ui('typeQuestion')}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isProcessing}
            aria-label="Your question"
          />

          <div className="query-box-actions">
            {textInput && (
              <button
                type="button"
                id="clear-query-button"
                className="action-btn-text clear-btn"
                onClick={handleClear}
                disabled={isProcessing}
              >
                {ui('clear')}
              </button>
            )}

            <button
              type="submit"
              id="submit-query-button"
              className="action-btn-primary ask-btn"
              disabled={isProcessing || !textInput.trim()}
            >
              {isProcessing ? (
                <span>{ui('processing')}</span>
              ) : (
                <>
                  <span>{ui('askButton')}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
