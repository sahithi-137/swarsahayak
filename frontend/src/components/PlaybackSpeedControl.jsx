import React from 'react';
import { VALID_SPEEDS } from '../services/audioPlayer';

/**
 * PlaybackSpeedControl Component
 * Renders the 4 mandatory playback speeds: 0.5x | 1x | 1.5x | 2x
 * Accessible via keyboard and screen-readers
 */
export default function PlaybackSpeedControl({
  currentSpeed = 1.0,
  onSpeedChange,
  disabled = false,
  label = 'Speed'
}) {
  const speedLabels = {
    0.5: '0.5×',
    1.0: '1×',
    1.5: '1.5×',
    2.0: '2×'
  };

  const speedDescriptions = {
    0.5: '0.5x half speed for slow and clear listening',
    1.0: '1x normal playback speed',
    1.5: '1.5x brisk playback speed',
    2.0: '2x double speed for fast review'
  };

  return (
    <div
      className="playback-speed-control-group"
      role="group"
      aria-label="Audio playback speed controls"
    >
      <span className="speed-group-label" id="speed-control-label">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <polygon points="13 19 22 12 13 5 13 19" />
          <polygon points="2 19 11 12 2 5 2 19" />
        </svg>
        <span>{label}:</span>
      </span>

      <div className="speed-buttons-wrapper">
        {VALID_SPEEDS.map((speed) => {
          const isActive = currentSpeed === speed;
          return (
            <button
              key={speed}
              id={`speed-btn-${speed.toString().replace('.', '_')}`}
              type="button"
              className={`speed-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSpeedChange && onSpeedChange(speed)}
              disabled={disabled}
              aria-pressed={isActive}
              aria-label={speedDescriptions[speed]}
              title={speedDescriptions[speed]}
            >
              {speedLabels[speed]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
