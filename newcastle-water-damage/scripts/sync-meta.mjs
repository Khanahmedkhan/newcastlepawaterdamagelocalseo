import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesSeo = JSON.parse(fs.readFileSync(path.join(root, 'data/pages-seo.json'), 'utf8'));

for (const [fileKey, page] of Object.entries(pagesSeo)) {
  const filePath = path.join(root, fileKey);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${page.description}">`
  );
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');

  fs.writeFileSync(filePath, html);
  console.log('Updated:', fileKey);
}
