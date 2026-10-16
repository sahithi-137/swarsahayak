import React, { useState, useEffect } from 'react';
import { audioPlayer } from '../services/audioPlayer';
import VoiceControls from './VoiceControls';
import { getUIText } from '../config/ui_translations';

export default function AnswerPanel({
  answerData,
  currentLanguage,
  simplifiedMode,
  onAskAgain
}) {
  const [playerState, setPlayerState] = useState(audioPlayer.getStatus());
  const [speechStatusMessage, setSpeechStatusMessage] = useState(null);

  if (!answerData) return null;

  const ui = (key) => getUIText(currentLanguage.code, key);

  // Subscribe to audio player changes
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((status) => {
      setPlayerState(status);
    });
    return () => unsubscribe();
  }, []);

  // When answerData changes: stop previous audio cleanly
  useEffect(() => {
    audioPlayer.stop();
    setSpeechStatusMessage(null);

    // Auto-read in simplified mode if voice is available
    if (simplifiedMode && (answerData.audio_available || answerData.audio_base64)) {
      handlePlay();
    }

    return () => {
      audioPlayer.stop();
    };
  }, [answerData]);

  const handlePlay = () => {
    setSpeechStatusMessage(null);
    const result = audioPlayer.play({
      text: answerData.answer,
      audioBase64: answerData.audio_base64,
      locale: currentLanguage.locale,
      langCode: answerData.answer_language || currentLanguage.code,
      provider: answerData.audio_provider || 'auto',
      metadata: {
        isRecorded: (answerData.audio_provider || '').toLowerCase().includes('recorded')
      }
    });

    if (result && !result.success && result.error) {
      setSpeechStatusMessage(result.error);
    }
  };

  const handlePause = () => {
    audioPlayer.pause();
  };

  const handleResume = () => {
    audioPlayer.resume();
  };

  const handleReplay = () => {
    setSpeechStatusMessage(null);
    audioPlayer.replay();
  };

  const handleStop = () => {
    audioPlayer.stop();
  };

  const handleSpeedChange = (speed) => {
    audioPlayer.setSpeed(speed);
  };

  const isAudioAvailable = answerData.audio_available || Boolean(answerData.audio_base64);

  return (
    <article className="answer-panel-card" aria-live="polite">
      {/* Header with Category Badge and Verified Pill */}
      <div className="answer-header">
        <div className="answer-category-row">
          <span className="badge category-badge">
            {answerData.category ? answerData.category.replace('_', ' ').toUpperCase() : 'GENERAL'}
          </span>
          <span className="badge verified-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Verified Official Info</span>
          </span>
        </div>

        <h3 className="answer-title">
          {answerData.matched_topic || answerData.query}
        </h3>
      </div>

      {/* Language / Translation Truthfulness Notice if present */}
      {answerData.language_notes && (
        <div className="language-truth-notice" role="note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{answerData.language_notes}</span>
        </div>
      )}

      {/* Complete Audio Controls Bar (Play, Pause, Resume, Replay, Stop + 0.5x, 1x, 1.5x, 2x speeds) */}
      <div className="audio-control-bar-wrapper">
        <VoiceControls
          isPlaying={playerState.isPlaying}
          isPaused={playerState.isPaused}
          currentSpeed={playerState.speed}
          onPlay={handlePlay}
          onPause={handlePause}
          onResume={handleResume}
          onReplay={handleReplay}
          onStop={handleStop}
          onSpeedChange={handleSpeedChange}
          audioAvailable={isAudioAvailable}
          audioProvider={answerData.audio_provider}
          provenanceDetails={{
            provider: answerData.audio_provider
          }}
          uiLabels={{
            listenAnswer: ui('listenAnswer'),
            stopAudio: ui('stopAudio'),
            replayAudio: ui('replayAudio'),
            readingModeNotice: ui('readingModeNotice'),
            speed: ui('speed')
          }}
        />
      </div>

      {/* Audio Status message if voice is missing or error occurred */}
      {speechStatusMessage && (
        <div className="speech-warning-pill" role="alert">
          <span>ℹ️ {speechStatusMessage}</span>
        </div>
      )}

      {/* Answer Body Text */}
      <div className="answer-text-content">
        {answerData.answer.split('\n\n').map((paragraph, index) => (
          <p key={index} className="answer-paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Healthcare or Safe Banking Disclaimers */}
      {answerData.disclaimer && (
        <div className="disclaimer-callout" role="alert">
          <div className="disclaimer-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="disclaimer-text">
            <strong>Important Safety Notice: </strong>
            {answerData.disclaimer}
          </div>
        </div>
      )}

      {/* Verified Official Sources Section */}
      {answerData.sources && answerData.sources.length > 0 && (
        <div className="sources-container">
          <h4 className="sources-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {ui('verifiedSource')}
          </h4>
          <div className="sources-list">
            {answerData.sources.map((src, i) => (
              <div key={i} className="source-link-card">
                <div className="source-info">
                  <a
                    href={src.verified_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-anchor"
                    title={`Visit official government portal: ${src.verified_url}`}
                  >
                    <span>{src.title}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <span className="source-publisher">{src.verified_source}</span>
                </div>
                <div className="source-date-tag">
                  {ui('verificationDate')}: {src.verification_date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
