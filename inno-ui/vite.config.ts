import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const sourceRoot = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(sourceRoot),
      },
    },
    server: {
      proxy: {
        '/profiles': {
          target: readEnv(env, 'PROFILES_PROXY_TARGET'),
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/profiles/, ''),
        },
        '/facility': {
          target: readEnv(env, 'FACILITY_PROXY_TARGET'),
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/facility/, ''),
        },
      },
    },
  };
});

function readEnv(env: Record<string, string>, name: string): string {
  const value = env[name];
  if (value === undefined || value.trim().length === 0) {
    throw new Error(`Missing ${name}. Set it in .env.`);
  }
  return value;
}
