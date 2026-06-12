import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const breadcrumbs = {
  'ellwood-city-pa/index.html': 'Ellwood City PA',
  'sharon-pa/index.html': 'Sharon PA',
  'grove-city-pa/index.html': 'Grove City PA',
  'greenville-pa/index.html': 'Greenville PA',
  'flood-damage/index.html': 'Flood Damage Restoration',
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
    (match, p1) => {
      if (match.includes('flood-damage')) return match;
      return match.replace(/<\/p>$/, '</p>\n        <a href="/flood-damage">Flood damage restoration →</a>');
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

  if (file.includes('-pa/index.html') && !html.includes('href="/greenville-pa"')) {
    html = html.replace(
      /(<div class="area-card"><h3>Grove City, PA<\/h3>[\s\S]*?<\/a><\/div>)\s*(<\/div>\s*<\/div>\s*<\/section>)/,
      `$1
      <div class="area-card"><h3>Greenville, PA</h3><p>Northwestern Mercer County along the Little Shenango River.</p><a href="/greenville-pa">View Greenville →</a></div>
    $2`
    );
  }

  fs.writeFileSync(filePath, html);
  console.log('Patched:', file);
}

// Flood + mold service cross-links
const floodPath = path.join(root, 'flood-damage/index.html');
let floodHtml = fs.readFileSync(floodPath, 'utf8');
if (!floodHtml.includes('Related Service Areas')) {
  floodHtml = floodHtml.replace(
    '<footer class="site-footer">',
    `<section class="section-sm bg-off-white">
  <div class="container">
    <div class="section-header" style="margin-bottom:24px;">
      <span class="section-label">Related Pages</span>
      <h2>Flood Restoration Across Lawrence & Mercer County</h2>
    </div>
    <div class="areas-grid">
      <div class="area-card"><h3>New Castle, PA</h3><p>Primary flood damage service area along the Shenango River.</p><a href="/">View New Castle →</a></div>
      <div class="area-card"><h3>Ellwood City, PA</h3><p>Connoquenessing Creek and Beaver River flood cleanup.</p><a href="/ellwood-city-pa">View Ellwood City →</a></div>
      <div class="area-card"><h3>Sharon, PA</h3><p>Shenango Valley river and storm flooding response.</p><a href="/sharon-pa">View Sharon →</a></div>
      <div class="area-card"><h3>Mold Remediation</h3><p>Post-flood mold prevention and certified removal.</p><a href="/mold-remediation">Mold services →</a></div>
    </div>
  </div>
</section>

<footer class="site-footer">`
  );
  fs.writeFileSync(floodPath, floodHtml);
}

const moldPath = path.join(root, 'mold-remediation/index.html');
let moldHtml = fs.readFileSync(moldPath, 'utf8');
if (!moldHtml.includes('Related Service Areas')) {
  moldHtml = moldHtml.replace(
    '<footer class="site-footer">',
    `<section class="section-sm bg-off-white">
  <div class="container">
    <div class="section-header" style="margin-bottom:24px;">
      <span class="section-label">Related Pages</span>
      <h2>Mold Help Across Our Service Area</h2>
    </div>
    <div class="areas-grid">
      <div class="area-card"><h3>New Castle, PA</h3><p>Lawrence County mold remediation hub.</p><a href="/">View New Castle →</a></div>
      <div class="area-card"><h3>Flood Damage</h3><p>Emergency flood cleanup that prevents mold growth.</p><a href="/flood-damage">Flood restoration →</a></div>
      <div class="area-card"><h3>Ellwood City, PA</h3><p>Mold and moisture issues in older borough homes.</p><a href="/ellwood-city-pa">View Ellwood City →</a></div>
      <div class="area-card"><h3>Greenville, PA</h3><p>Northwestern Mercer County mold response.</p><a href="/greenville-pa">View Greenville →</a></div>
    </div>
  </div>
</section>

<footer class="site-footer">`
  );
  fs.writeFileSync(moldPath, moldHtml);
}

console.log('Done.');
