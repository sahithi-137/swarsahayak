import React, { useState } from 'react';
import { LANGUAGES, REGIONS } from '../config/languages';
import { speechService } from '../services/speechService';
import { audioPlayer } from '../services/audioPlayer';

/**
 * LanguageSelector Component
 * Provides:
 * - Regional filtering tabs (North, Himalayan, East/Northeast, South, West/Central, Additional)
 * - Multi-criteria search (name, native script, dialect, locale)
 * - Honest capability badges (ASR, TTS, Translation, Verified Content)
 * - Interactive "Test Voice" preview button
 * - Provenance descriptions for recorded vs generated voice
 */
export default function LanguageSelector({
  currentLanguage,
  onSelectLanguage,
  onClose,
  uiLabels = {}
}) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [testingLangCode, setTestingLangCode] = useState(null);

  const filteredLanguages = LANGUAGES.filter((lang) => {
    // Region filter
    if (selectedRegion !== 'all' && lang.region !== selectedRegion) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.script.toLowerCase().includes(q) ||
        (lang.notes && lang.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleTestVoice = async (e, lang) => {
    e.stopPropagation(); // Don't trigger select
    if (testingLangCode === lang.code) {
      audioPlayer.stop();
      setTestingLangCode(null);
      return;
    }

    setTestingLangCode(lang.code);
    try {
      await speechService.testVoice(lang.code, lang.locale);
    } catch (err) {
      console.warn('Voice test failed:', err);
    } finally {
      // Clear testing indicator after 4 seconds
      setTimeout(() => {
        setTestingLangCode((prev) => (prev === lang.code ? null : prev));
      }, 4000);
    }
  };

  const getStatusBadge = (lang) => {
    switch (lang.speechStatus) {
      case 'voice_available':
        return (
          <span className="lang-status-badge badge-voice-available" title="Studio quality neural TTS or server voice available">
            <span className="status-dot green-dot">●</span>
            <span>Voice Available</span>
          </span>
        );
      case 'recorded_answers_available':
        return (
          <span className="lang-status-badge badge-recorded-available" title="Human-recorded native-speaker audio available">
            <span className="status-dot amber-dot">●</span>
            <span>Recorded Answers Available</span>
          </span>
        );
      default:
        return (
          <span className="lang-status-badge badge-setup-progress" title="Voice synthesis model in research pilot">
            <span className="status-dot gray-dot">●</span>
            <span>Voice Setup in Progress</span>
          </span>
        );
    }
  };

  return (
    <div className="language-selector-root" role="region" aria-label="Language Selector">
      {/* Search Bar */}
      <div className="lang-search-wrapper">
        <div className="lang-search-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="search"
          id="language-search-input"
          className="lang-search-input"
          placeholder="Search by language, script, or dialect (e.g. Bhojpuri, ᱥᱟᱱᱛᱟᱲᱤ, বাংলা, Haryanvi)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search languages by name or native script"
        />
        {searchQuery && (
          <button
            type="button"
            className="lang-search-clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Regional Filter Tabs */}
      <div className="region-tabs-bar" role="tablist" aria-label="Geographic Regions">
        {REGIONS.map((region) => {
          const isActive = selectedRegion === region.id;
          const count = region.id === 'all'
            ? LANGUAGES.length
            : LANGUAGES.filter(l => l.region === region.id).length;

          return (
            <button
              key={region.id}
              id={`region-tab-${region.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`region-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedRegion(region.id)}
            >
              <span>{region.label}</span>
              <span className="region-tab-count">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Languages Grid */}
      <div className="languages-scroll-container">
        {filteredLanguages.length === 0 ? (
          <div className="no-languages-found">
            <p>No languages matched your search query "{searchQuery}".</p>
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
              }}
            >
              Show all 35 languages
            </button>
          </div>
        ) : (
          <div className="languages-card-grid">
            {filteredLanguages.map((lang) => {
              const isSelected = lang.code === currentLanguage.code;
              const isTesting = testingLangCode === lang.code;
              const hasAudio = lang.capabilities.speechSynthesis || lang.recordedAudioAvailable;

              return (
                <div
                  key={lang.code}
                  id={`lang-card-${lang.code}`}
                  className={`language-catalogue-card ${isSelected ? 'active-selected' : ''}`}
                  onClick={() => {
                    onSelectLanguage(lang);
                    if (onClose) onClose();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectLanguage(lang);
                      if (onClose) onClose();
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${lang.name} (${lang.nativeName})`}
                >
                  {/* Top Row: Native Name & Active Badge */}
                  <div className="card-top-header">
                    <span className="card-native-name">{lang.nativeName}</span>
                    {isSelected && (
                      <span className="card-active-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  {/* Second Row: English Name and Script */}
                  <div className="card-meta-names">
                    <span className="card-english-name">{lang.name}</span>
                    <span className="card-script-tag">{lang.script}</span>
                  </div>

                  {/* Status Indicator */}
                  <div className="card-status-row">
                    {getStatusBadge(lang)}
                  </div>

                  {/* Separated 4 Capabilities Pills */}
                  <div className="card-capabilities-grid" title="Separated 4 Language Capabilities">
                    <span
                      className={`cap-indicator ${lang.capabilities.speechRecognition ? 'cap-yes' : 'cap-no'}`}
                      title={lang.capabilities.speechRecognition ? 'Speech Recognition (ASR) Supported' : 'Speech Recognition: Manual Text Input Required'}
                    >
                      🎤 {lang.capabilities.speechRecognition ? 'Voice In' : 'Text In'}
                    </span>
                    <span
                      className={`cap-indicator ${lang.capabilities.speechSynthesis ? 'cap-yes' : 'cap-no'}`}
                      title={lang.capabilities.speechSynthesis ? 'Spoken Voice Output Supported' : 'Voice Setup in Progress'}
                    >
                      🔊 {lang.capabilities.speechSynthesis ? 'Voice Out' : 'Reading'}
                    </span>
                    <span
                      className={`cap-indicator ${lang.capabilities.translation ? 'cap-yes' : 'cap-no'}`}
                      title="Verified Translation Supported"
                    >
                      🌐 Translation
                    </span>
                    <span
                      className={`cap-indicator ${lang.capabilities.answerContent ? 'cap-yes' : 'cap-no'}`}
                      title="Verified Content Available"
                    >
                      📚 Content
                    </span>
                  </div>

                  {/* Linguistic Note */}
                  {lang.notes && (
                    <p className="card-linguistic-note">{lang.notes}</p>
                  )}

                  {/* Card Bottom: Test Voice Button & Select Action */}
                  <div className="card-bottom-actions">
                    {hasAudio && (
                      <button
                        type="button"
                        id={`test-voice-btn-${lang.code}`}
                        className={`test-voice-btn ${isTesting ? 'testing' : ''}`}
                        onClick={(e) => handleTestVoice(e, lang)}
                        aria-label={`Test voice audio for ${lang.name}`}
                        title={`Listen to sample audio in ${lang.name}`}
                      >
                        {isTesting ? (
                          <>
                            <span className="speaker-anim-icon">🔊</span>
                            <span>Playing...</span>
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span>Test Voice</span>
                          </>
                        )}
                      </button>
                    )}

                    <span className="select-lang-hint">
                      {isSelected ? 'Selected' : 'Click to Switch →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
