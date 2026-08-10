import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_TARGET = env.VITE_PROXY_TARGET || 'https://backend.connectimi.in'

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    server: {
      // Proxy API calls through the dev server so the browser talks to its own
      // origin. Avoids cross-origin failures during local development.
      proxy: {
        '/api': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false, // allow self-signed / any SSL cert on upstream server
          configure: (proxy) => {
            proxy.on('proxyReq', (_proxyReq, req) => {
              console.log('[proxy →]', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('[proxy ←]', proxyRes.statusCode, req.url);
            });
            proxy.on('error', (err, req) => {
              console.error('[vite proxy error]', req?.url, err.message);
            });
          },
        },
      },
    },
  }
})
