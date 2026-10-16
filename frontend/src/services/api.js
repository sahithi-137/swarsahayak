/**
 * SwarSahayak API Service Client
 * Configured with relative API URL and LocalTunnel bypass header
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const TUNNEL_HEADERS = {
  'bypass-tunnel-reminder': '1'
};

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: TUNNEL_HEADERS
    });
    if (res.ok) {
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
      headers: TUNNEL_HEADERS
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error('Failed to fetch languages');
  } catch (err) {
    console.warn('Backend languages offline, using local config fallback', err);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      headers: TUNNEL_HEADERS
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch categories from server', err);
  }
  return null;
}

export async function askAssistant(query, language = 'hi', category = null) {
  try {
    const res = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TUNNEL_HEADERS
      },
      body: JSON.stringify({ query, language, category })
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to process question');
  } catch (err) {
    console.error('API ask error:', err);
    throw err;
  }
}

export async function synthesizeServerAudio(text, language = 'hi', rate = 1.0) {
  try {
    const res = await fetch(`${API_BASE_URL}/speech/synthesize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...TUNNEL_HEADERS
      },
      body: JSON.stringify({ text, language, rate })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Server TTS unavailable', err);
  }
  return null;
}

export const synthesizeSpeechAPI = synthesizeServerAudio;

export async function testVoiceAPI(languageCode = 'hi') {
  try {
    const res = await fetch(`${API_BASE_URL}/speech/test-voice/${languageCode}`, {
      method: 'GET',
      headers: TUNNEL_HEADERS
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Test voice API error:', err);
  }
  return null;
}

export async function fetchRecordingsAPI(languageCode = null, answerId = null) {
  try {
    const params = new URLSearchParams();
    if (languageCode) params.set('language', languageCode);
    if (answerId) params.set('answer_id', answerId);
    const res = await fetch(`${API_BASE_URL}/recordings?${params.toString()}`, {
      headers: TUNNEL_HEADERS
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Fetch recordings API error:', err);
  }
  return [];
}
