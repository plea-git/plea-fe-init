import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    // 로컬 개발 시 API 프록시 (CORS 우회)
    // /api 요청을 백엔드 서버로 전달하여 same-origin으로 처리
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //   },
    // },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        // 청크 파일명에 해시 포함 (캐시 버스팅)
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // 벤더 라이브러리 분리 (브라우저 캐싱 효율)
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/@tanstack/react-router')) {
            return 'router';
          }
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }
        },
      },
    },
  },
  // 프로덕션 빌드 시 console.log, console.debug를 no-op으로 치환
  define: {
    ...(process.env.NODE_ENV === 'production' && {
      'globalThis.console.log': '(() => {})',
      'globalThis.console.debug': '(() => {})',
    }),
  },
  // 의존성 사전 번들링 (dev 서버 초기 로딩 속도 개선)
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@tanstack/react-router',
      'zustand',
      'ky',
    ],
  },
});
