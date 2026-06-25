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
        'oakwood-pa': resolve(__dirname, 'oakwood-pa/index.html'),
        'oakland-pa': resolve(__dirname, 'oakland-pa/index.html'),
        'new-castle-northwest-pa': resolve(__dirname, 'new-castle-northwest-pa/index.html'),
        'south-new-castle-pa': resolve(__dirname, 'south-new-castle-pa/index.html'),
        'mahoningtown-pa': resolve(__dirname, 'mahoningtown-pa/index.html'),
        'east-new-castle-pa': resolve(__dirname, 'east-new-castle-pa/index.html'),
        'west-new-castle-pa': resolve(__dirname, 'west-new-castle-pa/index.html'),
        'downtown-new-castle-pa': resolve(__dirname, 'downtown-new-castle-pa/index.html'),
        'neshannock-township-pa': resolve(__dirname, 'neshannock-township-pa/index.html'),
        'north-hill-pa': resolve(__dirname, 'north-hill-pa/index.html'),
        'shenango-township-pa': resolve(__dirname, 'shenango-township-pa/index.html'),
        'union-township-pa': resolve(__dirname, 'union-township-pa/index.html'),
        'bessemer-pa': resolve(__dirname, 'bessemer-pa/index.html'),
        'hermitage-pa': resolve(__dirname, 'hermitage-pa/index.html'),
        'north-beaver-township-pa': resolve(__dirname, 'north-beaver-township-pa/index.html'),
        'taylor-township-pa': resolve(__dirname, 'taylor-township-pa/index.html'),
        'wampum-pa': resolve(__dirname, 'wampum-pa/index.html'),
        'water-damage-restoration': resolve(__dirname, 'water-damage-restoration/index.html'),
        'emergency-water-damage-restoration': resolve(__dirname, 'emergency-water-damage-restoration/index.html'),
        'basement-flooding': resolve(__dirname, 'basement-flooding/index.html'),
        'pipe-burst-water-damage': resolve(__dirname, 'pipe-burst-water-damage/index.html'),
        'roof-leak-water-damage': resolve(__dirname, 'roof-leak-water-damage/index.html'),
        'sewage-cleanup': resolve(__dirname, 'sewage-cleanup/index.html'),
        'storm-damage-restoration': resolve(__dirname, 'storm-damage-restoration/index.html'),
        'commercial-water-damage-restoration': resolve(__dirname, 'commercial-water-damage-restoration/index.html'),
        'crawl-space-water-damage': resolve(__dirname, 'crawl-space-water-damage/index.html'),
        'mold-remediation': resolve(__dirname, 'mold-remediation/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        '404': resolve(__dirname, '404.html'),
      },
    },
  },
});
