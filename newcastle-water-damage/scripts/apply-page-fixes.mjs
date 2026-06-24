import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const breadcrumbs = {
  'storm-damage-restoration/index.html': 'Storm Damage Restoration',
  'mold-remediation/index.html': 'Mold Remediation',
};

function breadcrumbNav(label) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <ol>
      <li><a href="/">Home</a></li>
      <li><span aria-current="page">${label}</span></li>
    </ol>
  </div>
</nav>

`;
}

for (const [file, label] of Object.entries(breadcrumbs)) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('class="breadcrumb"')) {
    html = html.replace('</header>\n\n', `</header>\n\n${breadcrumbNav(label)}`);
  }

  html = html.replace(
    /<h3>Mold Prevention and Remediation<\/h3>\s*<p>([\s\S]*?)<\/p>/g,
    '<h3>Mold Prevention and Remediation</h3>\n        <p>$1</p>\n        <a href="/mold-remediation">Mold remediation services →</a>'
  );

  html = html.replace(
    /<h3>Mold Prevention & Remediation<\/h3>\s*<p>([\s\S]*?)<\/p>/g,
    '<h3>Mold Prevention & Remediation</h3>\n        <p>$1</p>\n        <a href="/mold-remediation">Mold remediation services →</a>'
  );

  html = html.replace(
    /<h3>.*?Flood Cleanup<\/h3>\s*<p>([\s\S]*?)<\/p>/g,
    (match) => {
      if (match.includes('storm-damage-restoration')) return match;
      return match.replace(/<\/p>$/, '</p>\n        <a href="/storm-damage-restoration">Storm damage restoration →</a>');
    }
  );

  html = html.replace(
    /<span class="section-label">Also Serving[^<]*<\/span><h3>/g,
    '<span class="section-label">Also Serving Nearby</span><h2>'
  );

  html = html.replace(
    /<span class="section-label">Also Serving<\/span><h3>/g,
    '<span class="section-label">Also Serving Nearby</span><h2>'
  );

  fs.writeFileSync(filePath, html);
  console.log('Patched:', file);
}

console.log('Done.');
