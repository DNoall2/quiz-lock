import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json', // or wherever your manifest is
          dest: '.', // copies to root of dist/
        },
        {
          src: 'blocked.html',
          dest: '.', // optional if you want to move it out of dist/public
        },
        {
          src: 'src/background/background.js',
          dest: '.', // optional if you want to move it out of dist/public
        }
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: false, // Disable Vite's default copying of public/
});

