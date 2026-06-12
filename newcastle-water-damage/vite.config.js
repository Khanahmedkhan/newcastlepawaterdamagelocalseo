import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import { seoSchemaPlugin } from './plugins/vite-seo-plugin.js';

/** Serve /area-name as /area-name/index.html in dev and preview */
function cleanUrlsPlugin() {
  const middleware = (root) => (req, _res, next) => {
    if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next();

    const [pathname, ...rest] = req.url.split('?');
    const query = rest.length ? `?${rest.join('?')}` : '';

    if (pathname === '/' || pathname.includes('.')) return next();

    const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
    const indexPath = resolve(root, slug, 'index.html');

    if (slug && fs.existsSync(indexPath)) {
      req.url = `/${slug}/index.html${query}`;
    }

    next();
  };

  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use(middleware(server.config.root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(server.config.root));
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [cleanUrlsPlugin(), seoSchemaPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'ellwood-city-pa': resolve(__dirname, 'ellwood-city-pa/index.html'),
        'sharon-pa': resolve(__dirname, 'sharon-pa/index.html'),
        'grove-city-pa': resolve(__dirname, 'grove-city-pa/index.html'),
        'greenville-pa': resolve(__dirname, 'greenville-pa/index.html'),
        'flood-damage': resolve(__dirname, 'flood-damage/index.html'),
        'mold-remediation': resolve(__dirname, 'mold-remediation/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        '404': resolve(__dirname, '404.html'),
      },
    },
  },
});
