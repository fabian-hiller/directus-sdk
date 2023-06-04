import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    test: {
      setupFiles: ['dotenv/config'],
      include: ['./src/**/*.test.ts'],
      singleThread: true,
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      minify: false,
    },
  };
});
