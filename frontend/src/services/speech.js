/**
 * Web Speech API Integration for SwarSahayak
 * Manages SpeechRecognition and SpeechSynthesis with truthful locale detection,
 * error handling, and session cleanliness.
 */
import { audioPlayer } from './audioPlayer';

// Check browser support
export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

class SpeechController {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.activeAudio = null;
    this.voices = [];
    this.initVoices();
  }

  initVoices() {
    if (!isSpeechSynthesisSupported()) return;
    const updateVoices = () => {
      this.voices = window.speechSynthesis.getVoices() || [];
    };
    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  getAvailableVoices() {
    if (!this.voices.length && isSpeechSynthesisSupported()) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
    return this.voices;
  }

  findMatchingVoice(locale, langCode) {
    const voices = this.getAvailableVoices();
    if (!voices || voices.length === 0) return null;

    const locLower = (locale || '').toLowerCase();
    const langLower = (langCode || '').toLowerCase();

    // 1. Exact locale match (e.g., 'hi-IN')
    let match = voices.find(v => (v.lang || '').toLowerCase() === locLower);
    if (match) return match;

    // 2. Exact prefix match (e.g. 'hi')
    match = voices.find(v => (v.lang || '').toLowerCase().startsWith(langLower + '-') || (v.lang || '').toLowerCase() === langLower);
    if (match) return match;

    return null;
  }

  /**
   * Start Speech Recognition
   * @param {Object} options
   * @param {string} options.locale e.g. 'hi-IN'
   * @param {Function} options.onResult (interimText, finalText) => void
   * @param {Function} options.onError (errorMsg) => void
   * @param {Function} options.onEnd () => void
   */
  startListening({ locale, onResult, onError, onEnd }) {
    if (!isSpeechRecognitionSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or text input.');
      return false;
    }

    // Stop any existing session cleanly
    this.stopListening();
    this.stopSpeaking();

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = locale || 'hi-IN';
      this.recognition.maxAlternatives = 1;

      let finalTranscript = '';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            interimTranscript += res[0].transcript;
          }
        }
        if (onResult) {
          onResult(interimTranscript, finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        let message = 'Microphone error occurred.';
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            message = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
            break;
          case 'no-speech':
            message = 'No speech was detected. Please press the mic and speak clearly.';
            break;
          case 'network':
            message = 'Network error during speech recognition. Please check your internet connection.';
            break;
          case 'language-not-supported':
            message = `Speech recognition locale (${locale}) is not supported by your browser engine.`;
            break;
          default:
            message = `Speech recognition error: ${event.error}`;
        }
        if (onError) onError(message);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      this.isListening = false;
      if (onError) onError(`Could not start recognition: ${err.message}`);
      return false;
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        // Ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  /**
   * Speak Text
   * Checks matching voice to maintain phonetic honesty.
   * If base64 audio is provided from backend, plays audio element instead.
   */
  speakText({ text, locale, langCode, audioBase64, rate = 1.0, onStart, onEnd, onError }) {
    this.stopSpeaking();

    // Priority 1: Play verified server audio if available
    if (audioBase64) {
      try {
        const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
        audio.playbackRate = rate || 1.0;
        this.activeAudio = audio;

        audio.onplay = () => { if (onStart) onStart(); };
        audio.onended = () => {
          this.activeAudio = null;
          if (onEnd) onEnd();
        };
        audio.onerror = (e) => {
          this.activeAudio = null;
          if (onError) onError('Failed to play server audio.');
        };

        audio.play().catch(err => {
          console.warn('Audio play autoplay restriction:', err);
          if (onError) onError('Please click the Play button to hear audio.');
        });
        return { mode: 'server_audio' };
      } catch (err) {
        console.warn('Audio creation error:', err);
      }
    }

    // Priority 2: Use browser Web Speech API synthesis
    if (!isSpeechSynthesisSupported()) {
      if (onError) onError('Speech synthesis is not supported on this browser.');
      return { mode: 'unsupported' };
    }

    const voice = this.findMatchingVoice(locale, langCode);

    // Phonetic Integrity Check:
    // Do NOT play English voice pronouncing Hindi or Odia text!
    if (!voice && langCode !== 'en') {
      const msg = `No native browser voice found for ${locale || langCode}. Manual reading mode is active to prevent wrong pronunciation.`;
      if (onError) onError(msg);
      return { mode: 'no_matching_voice', message: msg };
    }

    try {
      window.speechSynthesis.cancel();

      // Clean markdown bullets or symbols for speech
      const cleanSpeechText = text
        .replace(/•/g, ', ')
        .replace(/\n+/g, '. ')
        .replace(/[*_#]/g, '')
        .substring(0, 500);

      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = locale || 'en-IN';
      }

      utterance.rate = rate || 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && onError) {
          onError(`Speech synthesis stopped: ${e.error}`);
        }
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
      return { mode: 'browser_voice', voiceName: voice ? voice.name : 'Default' };
    } catch (err) {
      if (onError) onError(`Speech error: ${err.message}`);
      return { mode: 'error' };
    }
  }

  stopSpeaking() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }
    if (isSpeechSynthesisSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    try {
      audioPlayer.stop();
    } catch (e) {}
  }
}

export const speechController = new SpeechController();
