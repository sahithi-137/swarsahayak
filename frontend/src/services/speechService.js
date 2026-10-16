/**
 * SwarSahayak Speech Service
 * Unified speech input (ASR / STT) and speech synthesis orchestration.
 * Coordinates with backend speech providers and fallback client Web Speech API.
 */

import { audioPlayer } from './audioPlayer';
import { synthesizeSpeechAPI, testVoiceAPI } from './api';

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
  }

  /**
   * Start Speech Recognition (Microphone to Text)
   */
  startListening({ locale, onResult, onError, onEnd }) {
    if (!isSpeechRecognitionSupported()) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or text input.');
      return false;
    }

    this.stopListening();
    audioPlayer.stop();

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

  /**
   * Stop Speech Recognition
   */
  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }
    this.isListening = false;
  }

  /**
   * Play spoken answer text using audioPlayer
   */
  async speakAnswer({
    text,
    audioBase64,
    audioUrl,
    langCode,
    locale,
    provider,
    metadata
  }) {
    return audioPlayer.play({
      text,
      audioBase64,
      audioUrl,
      langCode,
      locale,
      provider,
      metadata
    });
  }

  /**
   * Test Voice for a specific language
   */
  async testVoice(langCode, locale) {
    try {
      const data = await testVoiceAPI(langCode);
      if (data && data.audio_base64) {
        return audioPlayer.play({
          text: data.sample_text || 'Test voice audio',
          audioBase64: data.audio_base64,
          langCode,
          locale,
          provider: data.provider || 'Test Voice Audio'
        });
      }
    } catch (e) {
      console.warn('Backend test voice endpoint unavailable, falling back to browser synthesis:', e);
    }

    // Client-side fallback if server test voice unavailable
    return audioPlayer.play({
      text: 'नमस्ते, स्वर सहायक में आपका स्वागत है।',
      langCode,
      locale,
      provider: 'Browser Speech Fallback'
    });
  }
}

export const speechService = new SpeechService();
export default speechService;
