/**
 * SwarSahayak Shared Audio Player Service
 * 
 * Supports:
 * - Server-generated audio (Base64 / Audio URL)
 * - Human-recorded native-speaker audio
 * - Client-side browser Web Speech API synthesis
 * 
 * Features:
 * - 4 Mandatory speeds: 0.5x | 1x | 1.5x | 2x
 * - Persistent speed memory via localStorage
 * - Dynamic client-side rate adjustments without regenerating audio
 * - Full controls: Play, Pause, Resume, Replay, Stop
 * - State subscription for reactive UI components
 */

const SPEED_STORAGE_KEY = 'swarsahayak_playback_speed';
export const VALID_SPEEDS = [0.5, 1.0, 1.5, 2.0];

class AudioPlayerService {
  constructor() {
    this.audioElement = null;
    this.currentUtterance = null;
    this.state = 'idle'; // 'idle' | 'playing' | 'paused' | 'stopped'
    this.mode = 'none'; // 'server_audio' | 'recorded_audio' | 'browser_voice' | 'none'
    this.currentTrack = null;
    this.listeners = new Set();

    // Load persisted playback speed, default to 1.0x
    const savedSpeed = parseFloat(localStorage.getItem(SPEED_STORAGE_KEY));
    this.speed = VALID_SPEEDS.includes(savedSpeed) ? savedSpeed : 1.0;

    // Pre-cache browser voices
    this.voices = [];
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this._updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this._updateVoices();
      }
    }
  }

  _updateVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
  }

  /**
   * Subscribe to state and playback changes
   * @param {Function} callback ({ state, speed, mode, currentTrack }) => void
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getStatus());
    return () => this.listeners.delete(callback);
  }

  _notify() {
    const status = this.getStatus();
    this.listeners.forEach((fn) => {
      try {
        fn(status);
      } catch (err) {
        console.error('AudioPlayer listener error:', err);
      }
    });
  }

  getStatus() {
    return {
      state: this.state,
      speed: this.speed,
      mode: this.mode,
      currentTrack: this.currentTrack,
      isPlaying: this.state === 'playing',
      isPaused: this.state === 'paused',
      isStopped: this.state === 'stopped' || this.state === 'idle'
    };
  }

  /**
   * Set playback speed (0.5x, 1x, 1.5x, 2x)
   * Applies immediately to current playback without re-synthesizing
   */
  setSpeed(newSpeed) {
    const parsed = parseFloat(newSpeed);
    if (!VALID_SPEEDS.includes(parsed)) return;

    this.speed = parsed;
    try {
      localStorage.setItem(SPEED_STORAGE_KEY, parsed.toString());
    } catch (e) {
      // Ignore storage errors in private browsing
    }

    // Adjust HTMLAudioElement speed in real-time
    if (this.audioElement) {
      this.audioElement.playbackRate = this.speed;
      // Preserve pitch for natural vocal timber
      if ('preservesPitch' in this.audioElement) {
        this.audioElement.preservesPitch = true;
      }
    }

    // For browser speech synthesis: if currently playing, we adjust utterance
    if (this.mode === 'browser_voice' && this.state === 'playing' && this.currentTrack) {
      const remainingText = this.currentTrack.text;
      const locale = this.currentTrack.locale;
      const langCode = this.currentTrack.langCode;
      this.stop();
      this.playBrowserSpeech({
        text: remainingText,
        locale,
        langCode,
        metadata: this.currentTrack.metadata
      });
    }

    this._notify();
  }

  /**
   * Find matching browser speech synthesis voice
   */
  findBrowserVoice(locale, langCode) {
    this._updateVoices();
    if (!this.voices || this.voices.length === 0) return null;

    const loc = (locale || '').toLowerCase();
    const code = (langCode || '').toLowerCase();

    // Exact locale match
    let match = this.voices.find(v => (v.lang || '').toLowerCase() === loc);
    if (match) return match;

    // Language prefix match
    match = this.voices.find(v => {
      const vLang = (v.lang || '').toLowerCase();
      return vLang.startsWith(`${code}-`) || vLang === code;
    });
    return match || null;
  }

  /**
   * Main play method supporting Server Audio, Recorded Audio, or Browser Speech
   */
  async play({
    text,
    audioBase64,
    audioUrl,
    locale = 'hi-IN',
    langCode = 'hi',
    provider = 'auto',
    metadata = {}
  }) {
    this.stop();

    // Priority 1: Audio URL or Base64 (from Edge TTS, gTTS, or Native Speaker Recording)
    if (audioBase64 || audioUrl) {
      return this.playAudioElement({
        audioBase64,
        audioUrl,
        text,
        langCode,
        locale,
        provider,
        metadata
      });
    }

    // Priority 2: Fall back to client-side Web Speech API
    return this.playBrowserSpeech({
      text,
      locale,
      langCode,
      metadata
    });
  }

  /**
   * Play using HTMLAudioElement (Server Neural TTS or Human Recording)
   */
  playAudioElement({ audioBase64, audioUrl, text, langCode, locale, provider, metadata = {} }) {
    try {
      const src = audioBase64
        ? `data:audio/mpeg;base64,${audioBase64}`
        : audioUrl;

      const audio = new Audio(src);
      this.audioElement = audio;
      this.audioElement.playbackRate = this.speed;
      if ('preservesPitch' in this.audioElement) {
        this.audioElement.preservesPitch = true;
      }

      const isRecorded = provider.toLowerCase().includes('record') || metadata.isRecorded;
      this.mode = isRecorded ? 'recorded_audio' : 'server_audio';
      this.currentTrack = {
        text,
        langCode,
        locale,
        provider,
        metadata
      };

      audio.onplay = () => {
        this.state = 'playing';
        this._notify();
      };

      audio.onpause = () => {
        if (this.state === 'playing') {
          this.state = 'paused';
          this._notify();
        }
      };

      audio.onended = () => {
        this.state = 'stopped';
        this.audioElement = null;
        this._notify();
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        this.state = 'stopped';
        this.audioElement = null;
        this._notify();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented or playback interrupted:', err);
          this.state = 'stopped';
          this._notify();
        });
      }

      return { success: true, mode: this.mode };
    } catch (err) {
      console.error('Failed to initialize audio element:', err);
      this.state = 'stopped';
      this._notify();
      return { success: false, error: err.message };
    }
  }

  /**
   * Play using browser Web Speech API (speechSynthesis)
   */
  playBrowserSpeech({ text, locale, langCode, metadata = {} }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.state = 'stopped';
      this._notify();
      return { success: false, error: 'Web Speech API is not supported in this browser.' };
    }

    const voice = this.findBrowserVoice(locale, langCode);

    // Phonetic protection: don't let English pronounce Indian languages if no native voice exists
    if (!voice && langCode !== 'en') {
      this.state = 'stopped';
      this._notify();
      return {
        success: false,
        error: `No native browser voice installed for ${locale || langCode}. Manual reading mode active to prevent mispronunciation.`
      };
    }

    try {
      window.speechSynthesis.cancel();

      // Clean markdown bullets and symbols for speech clarity
      const cleanText = text
        .replace(/[•*#_`]/g, ' ')
        .replace(/\n+/g, '. ')
        .substring(0, 600);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = locale || 'en-IN';
      }

      utterance.rate = this.speed;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.state = 'playing';
        this._notify();
      };

      utterance.onpause = () => {
        this.state = 'paused';
        this._notify();
      };

      utterance.onresume = () => {
        this.state = 'playing';
        this._notify();
      };

      utterance.onend = () => {
        this.state = 'stopped';
        this.currentUtterance = null;
        this._notify();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', e.error);
        }
        this.state = 'stopped';
        this.currentUtterance = null;
        this._notify();
      };

      this.currentUtterance = utterance;
      this.mode = 'browser_voice';
      this.currentTrack = {
        text,
        langCode,
        locale,
        provider: voice ? `Browser (${voice.name})` : 'Browser Speech',
        metadata
      };

      window.speechSynthesis.speak(utterance);
      return { success: true, mode: 'browser_voice' };
    } catch (err) {
      console.error('Speech synthesis initiation failed:', err);
      this.state = 'stopped';
      this._notify();
      return { success: false, error: err.message };
    }
  }

  /**
   * Pause current playback
   */
  pause() {
    if (this.audioElement && this.state === 'playing') {
      this.audioElement.pause();
      this.state = 'paused';
      this._notify();
      return true;
    }
    if (this.mode === 'browser_voice' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.state = 'paused';
      this._notify();
      return true;
    }
    return false;
  }

  /**
   * Resume paused playback
   */
  resume() {
    if (this.audioElement && this.state === 'paused') {
      this.audioElement.play().catch(e => console.warn('Audio resume error:', e));
      this.state = 'playing';
      this._notify();
      return true;
    }
    if (this.mode === 'browser_voice' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.state = 'playing';
      this._notify();
      return true;
    }
    // If stopped but track exists, replay
    if (this.currentTrack) {
      return this.replay();
    }
    return false;
  }

  /**
   * Replay active answer from beginning
   */
  replay() {
    if (!this.currentTrack) return false;

    if (this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.playbackRate = this.speed;
      this.audioElement.play().catch(e => console.warn('Audio replay error:', e));
      this.state = 'playing';
      this._notify();
      return true;
    }

    if (this.currentTrack) {
      return this.play({
        text: this.currentTrack.text,
        locale: this.currentTrack.locale,
        langCode: this.currentTrack.langCode,
        provider: this.currentTrack.provider,
        metadata: this.currentTrack.metadata
      });
    }
    return false;
  }

  /**
   * Completely stop audio and cancel pending utterances
   */
  stop() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (e) {}
      this.audioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      this.currentUtterance = null;
    }

    this.state = 'stopped';
    this.mode = 'none';
    this._notify();
  }
}

export const audioPlayer = new AudioPlayerService();
export default audioPlayer;
