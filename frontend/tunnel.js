import localtunnel from 'localtunnel';

const PORT = 5173;
const LOCAL_HOST = '127.0.0.1';

async function getPublicIP() {
  try {
    const res = await fetch('https://api.ipify.org', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return (await res.text()).trim();
    }
  } catch (e) {
    // Fallback if IP detection fails
  }
  return '103.24.85.88';
}

async function run() {
  const publicIP = await getPublicIP();

  console.log('=====================================================================');
  console.log('  SWARSAHAYAK — RESILIENT LOCALTUNNEL RUNNER');
  console.log('=====================================================================');
  console.log(`[*] Target Server: http://${LOCAL_HOST}:${PORT}`);
  console.log(`[*] Tunnel Password (Your Public IP): ${publicIP}`);
  console.log('---------------------------------------------------------------------');

  let activeTunnel = null;
  let isConnecting = false;

  async function establish() {
    if (isConnecting) return;
    isConnecting = true;

    try {
      if (activeTunnel) {
        try { activeTunnel.close(); } catch (_) {}
        activeTunnel = null;
      }

      console.log('[*] Connecting to LocalTunnel server...');
      activeTunnel = await localtunnel({
        port: PORT,
        local_host: LOCAL_HOST
      });

      console.log('\n>>> PUBLIC URL IS READY:');
      console.log(`>>> ${activeTunnel.url}\n`);
      console.log(`>>> NOTE: If prompted in browser, enter Password: ${publicIP}`);
      console.log('---------------------------------------------------------------------');

      activeTunnel.on('close', () => {
        console.warn('[!] Tunnel closed. Auto-reconnecting in 3 seconds...');
        activeTunnel = null;
        setTimeout(establish, 3000);
      });

      activeTunnel.on('error', (err) => {
        console.error('[!] Tunnel error:', err?.message || err);
        try { activeTunnel?.close(); } catch (_) {}
        activeTunnel = null;
        setTimeout(establish, 3000);
      });

    } catch (err) {
      console.error('[!] Connection failed:', err?.message || err);
      console.log('[*] Retrying in 5 seconds...');
      setTimeout(establish, 5000);
    } finally {
      isConnecting = false;
    }
  }

  // Keep-alive heartbeat: ping backend health through tunnel every 25 seconds
  setInterval(async () => {
    if (activeTunnel && activeTunnel.url) {
      try {
        await fetch(`${activeTunnel.url}/api/health`, {
          headers: { 'bypass-tunnel-reminder': '1' },
          signal: AbortSignal.timeout(8000)
        });
      } catch (_) {
        // Heartbeat timeout or drop
      }
    }
  }, 25000);

  establish();
}

run();
