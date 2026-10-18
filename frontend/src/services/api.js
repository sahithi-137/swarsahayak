/**
 * SwarSahayak API Service Client
 * Supports dynamic production backend URLs (VITE_API_URL), relative routes,
 * and reliable local verified fallback for seamless offline/static deployment.
 */
import { matchLocalQuery } from './localAssistant';
import { LANGUAGES } from '../config/languages';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const HEADERS = {
  'bypass-tunnel-reminder': '1'
};

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: HEADERS,
      signal: AbortSignal.timeout(2500)
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      return await res.json();
    }
    return { status: 'offline' };
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function fetchLanguages() {
  try {
    const res = await fetch(`${API_BASE_URL}/languages`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(2500)
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    console.info('Backend languages offline, using client catalogue fallback.');
  }
  return LANGUAGES;
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(2500)
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Silent fallback
  }
  return null;
}

export async function askAssistant(query, language = 'hi', category = null) {
  // 1. Attempt to query backend if accessible
  try {
    const res = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...HEADERS
      },
      body: JSON.stringify({ query, language, category }),
      signal: AbortSignal.timeout(1800)
    });

    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      const data = await res.json();
      if (data && data.answer) {
        return data;
      }
    }
  } catch (err) {
    // Immediate fallback without throwing to UI
  }

  // 2. Seamless verified local knowledge fallback
  return matchLocalQuery(query, language, category);
}

export async function synthesizeServerAudio(text, language = 'hi', rate = 1.0) {
  try {
    const res = await fetch(`${API_BASE_URL}/speech/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...HEADERS
      },
      body: JSON.stringify({ text, language, rate }),
      signal: AbortSignal.timeout(4000)
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Client-side Web Speech API will handle playback
  }
  return null;
}

export const synthesizeSpeechAPI = synthesizeServerAudio;

export async function testVoiceAPI(languageCode = 'hi') {
  try {
    const res = await fetch(`${API_BASE_URL}/speech/test-voice/${languageCode}`, {
      method: 'GET',
      headers: HEADERS,
      signal: AbortSignal.timeout(3000)
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Ignore
  }
  return null;
}

export async function fetchRecordingsAPI(languageCode = null, answerId = null) {
  try {
    const params = new URLSearchParams();
    if (languageCode) params.set('language', languageCode);
    if (answerId) params.set('answer_id', answerId);
    const res = await fetch(`${API_BASE_URL}/recordings?${params.toString()}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(3000)
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      return await res.json();
    }
  } catch (err) {
    // Ignore
  }
  return null;
}
