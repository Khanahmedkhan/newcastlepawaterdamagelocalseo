import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const locationSlugs = [
  'oakwood-pa',
  'oakland-pa',
  'new-castle-northwest-pa',
  'south-new-castle-pa',
  'mahoningtown-pa',
  'east-new-castle-pa',
  'west-new-castle-pa',
  'downtown-new-castle-pa',
  'neshannock-township-pa',
  'north-hill-pa',
  'shenango-township-pa',
  'union-township-pa',
  'bessemer-pa',
  'hermitage-pa',
  'north-beaver-township-pa',
  'taylor-township-pa',
  'wampum-pa',
];

const nearbySectionPattern =
  /\n?(?:<!-- RELATED -->\s*\n)?<section style="background:#f7f9ff; max-width:100%; padding-left:0; padding-right:0;">\s*\n\s*<div style="max-width:960px; margin:0 auto; padding:64px 24px;">\s*\n\s*<div class="section-label">Nearby Service Areas<\/div>[\s\S]*?<\/section>\s*/g;

for (const slug of locationSlugs) {
  const file = path.join(root, `${slug}/index.html`);
  let html = fs.readFileSync(file, 'utf8');
  const updated = html.replace(nearbySectionPattern, '\n');

  if (updated === html) {
    console.log('no match:', slug);
    continue;
  }

  fs.writeFileSync(file, updated);
  console.log('removed:', slug);
}
