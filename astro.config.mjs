import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://missaleapp.com',
  output: 'static',
  trailingSlash: 'never',
  // CSS pequeno: embutido no HTML para não bloquear a renderização.
  build: { format: 'directory', inlineStylesheets: 'always' },
});
