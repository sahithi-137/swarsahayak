import React from 'react';
import PlaybackSpeedControl from './PlaybackSpeedControl';

/**
 * VoiceControls Component
 * Provides complete audio playback controls: Play, Pause, Resume, Replay, Stop
 * plus the 4 playback speeds (0.5x, 1x, 1.5x, 2x) and truthful provenance badge.
 */
export default function VoiceControls({
  isPlaying,
  isPaused,
  currentSpeed,
  onPlay,
  onPause,
  onResume,
  onReplay,
  onStop,
  onSpeedChange,
  audioAvailable = true,
  audioProvider = 'auto',
  provenanceDetails = null,
  uiLabels = {}
}) {
  const getProviderBadge = () => {
    const prov = (audioProvider || '').toLowerCase();
    if (prov.includes('recorded') || prov.includes('native_speaker')) {
      return {
        label: 'Verified Native Speaker Recording',
        cls: 'provenance-recorded',
        icon: '🎙️'
      };
    }
    if (prov.includes('edge') || prov.includes('neural')) {
      return {
        label: 'Neural Voice (Edge Studio Quality)',
        cls: 'provenance-neural',
        icon: '⚡'
      };
    }
    if (prov.includes('bhashini')) {
      return {
        label: 'Bhashini (National Language Mission)',
        cls: 'provenance-bhashini',
        icon: '🏛️'
      };
    }
    if (prov.includes('gtts') || prov.includes('server')) {
      return {
        label: 'Server Indian Language Speech',
        cls: 'provenance-server',
        icon: '🔊'
      };
    }
    if (prov.includes('browser')) {
      return {
        label: 'Browser Web Speech Voice',
        cls: 'provenance-browser',
        icon: '🌐'
      };
    }
    return {
      label: 'Native Audio Output',
      cls: 'provenance-generic',
      icon: '🔊'
    };
  };

  const badge = getProviderBadge();

  return (
    <div className="voice-controls-container" role="region" aria-label="Audio Controls">
      {/* Primary Playback Action Buttons */}
      <div className="voice-action-buttons">
        {audioAvailable ? (
          <>
            {/* Play / Pause / Resume Button */}
            {!isPlaying && !isPaused ? (
              <button
                id="voice-control-play-btn"
                type="button"
                className="voice-btn primary-play-btn"
                onClick={onPlay}
                aria-label={uiLabels.listenAnswer || 'Listen to Answer'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{uiLabels.listenAnswer || 'Listen Answer'}</span>
              </button>
            ) : isPaused ? (
              <button
                id="voice-control-resume-btn"
                type="button"
                className="voice-btn resume-btn"
                onClick={onResume}
                aria-label="Resume audio playback"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Resume (चालू करें)</span>
              </button>
            ) : (
              <button
                id="voice-control-pause-btn"
                type="button"
                className="voice-btn pause-btn"
                onClick={onPause}
                aria-label="Pause audio playback"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Pause (रोकें)</span>
              </button>
            )}

            {/* Stop Button */}
            {(isPlaying || isPaused) && (
              <button
                id="voice-control-stop-btn"
                type="button"
                className="voice-btn stop-btn"
                onClick={onStop}
                aria-label="Stop audio playback"
                title="Stop audio playback"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
                <span>Stop</span>
              </button>
            )}

            {/* Replay Button */}
            <button
              id="voice-control-replay-btn"
              type="button"
              className="voice-btn replay-btn"
              onClick={onReplay}
              aria-label={uiLabels.replayAudio || 'Replay from start'}
              title={uiLabels.replayAudio || 'Replay audio'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>{uiLabels.replayAudio || 'Replay'}</span>
            </button>
          </>
        ) : (
          <div className="manual-reading-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>{uiLabels.readingModeNotice || 'Manual Reading Mode (Voice in setup)'}</span>
          </div>
        )}
      </div>

      {/* Playback Speed Controls (0.5x, 1x, 1.5x, 2x) */}
      {audioAvailable && (
        <PlaybackSpeedControl
          currentSpeed={currentSpeed}
          onSpeedChange={onSpeedChange}
          label={uiLabels.speed || 'Speed'}
        />
      )}

      {/* Audio Provenance Badge */}
      {audioAvailable && (
        <div className={`audio-provenance-pill ${badge.cls}`}>
          <span className="prov-icon" aria-hidden="true">{badge.icon}</span>
          <span className="prov-label">{badge.label}</span>
          {provenanceDetails?.speaker && (
            <span className="prov-meta">• Contributor: {provenanceDetails.speaker}</span>
          )}
          {provenanceDetails?.dialect && (
            <span className="prov-meta">({provenanceDetails.dialect})</span>
          )}
        </div>
      )}
    </div>
  );
}
