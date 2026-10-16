import React, { useState } from 'react';
import { LANGUAGES, REGIONS } from '../config/languages';

export default function CapabilityMatrixModal({ isOpen, onClose }) {
  const [regionFilter, setRegionFilter] = useState('all');

  if (!isOpen) return null;

  const filtered = LANGUAGES.filter((l) => {
    if (regionFilter === 'all') return true;
    return l.region === regionFilter;
  });

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="matrix-title">
      <div className="modal-content matrix-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 id="matrix-title" className="modal-title">
              Language Capability & Speech Verification Matrix
            </h2>
            <p className="modal-subtitle">
              Transparent, audited status of features across all {LANGUAGES.length} Indian languages & varieties.
            </p>
          </div>
          <button id="close-capability-matrix-modal" className="modal-close-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Regional Filter Tabs */}
        <div className="matrix-filter-row">
          {REGIONS.map((r) => {
            const count = r.id === 'all'
              ? LANGUAGES.length
              : LANGUAGES.filter(l => l.region === r.id).length;
            return (
              <button
                key={r.id}
                className={`lang-tab-pill ${regionFilter === r.id ? 'active' : ''}`}
                onClick={() => setRegionFilter(r.id)}
              >
                {r.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Matrix Table */}
        <div className="matrix-table-wrap">
          <table className="matrix-table" aria-label="Language capabilities table">
            <thead>
              <tr>
                <th>Language</th>
                <th>Region</th>
                <th>Script</th>
                <th>Locale</th>
                <th>Speech Recognition (ASR)</th>
                <th>Speech Synthesis (TTS)</th>
                <th>Translation</th>
                <th>Verified Content</th>
                <th>Speech Output Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lang) => {
                const c = lang.capabilities;
                const isVoice = lang.speechStatus === 'voice_available';
                const isRecorded = lang.speechStatus === 'recorded_answers_available';

                return (
                  <tr key={lang.code}>
                    <td className="lang-col">
                      <div className="lang-name-stack">
                        <span className="lang-native-bold">{lang.nativeName}</span>
                        <span className="lang-en-muted">{lang.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="script-badge">
                        {lang.region ? lang.region.replace('_', ' ') : 'General'}
                      </span>
                    </td>
                    <td><span className="script-badge">{lang.script}</span></td>
                    <td><code>{lang.locale}</code></td>
                    <td className="status-cell">
                      {c.speechRecognition ? (
                        <span className="check-mark">✓ {lang.asrProvider === 'browser_web_speech' ? 'Web Speech' : 'ASR Engine'}</span>
                      ) : (
                        <span className="manual-mark">✍️ Text In</span>
                      )}
                    </td>
                    <td className="status-cell">
                      {isVoice ? (
                        <span className="check-mark">⚡ Neural TTS</span>
                      ) : isRecorded ? (
                        <span className="recorded-mark">🎙️ Recorded Audio</span>
                      ) : (
                        <span className="pilot-mark">⏳ In Pilot</span>
                      )}
                    </td>
                    <td className="status-cell">
                      {c.translation ? <span className="check-mark">✓ Verified</span> : <span className="cross-mark">—</span>}
                    </td>
                    <td className="status-cell">
                      {c.answerContent ? <span className="check-mark">✓ Curated</span> : <span className="cross-mark">—</span>}
                    </td>
                    <td>
                      <span className="status-label-badge">
                        {lang.statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="modal-footer-note">
          <p>
            <strong>Engineering Transparency:</strong> SwarSahayak does not falsely simulate accents or switch regional dialects to standard Hindi/English.
            Languages marked with 🎙️ Recorded Audio use authentic native-speaker recordings reviewed by community language cells.
          </p>
        </div>
      </div>
    </div>
  );
}
