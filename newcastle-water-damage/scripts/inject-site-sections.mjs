import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const serviceSlugs = [
  'water-damage-restoration',
  'emergency-water-damage-restoration',
  'basement-flooding',
  'pipe-burst-water-damage',
  'roof-leak-water-damage',
  'sewage-cleanup',
  'storm-damage-restoration',
  'commercial-water-damage-restoration',
  'crawl-space-water-damage',
  'mold-remediation',
];

const locationSlugs = [
  'oakwood-pa',
  'oakland-pa',
  'new-castle-northwest-pa',
  'south-new-castle-pa',
  'mahoningtown-pa',
  'east-new-castle-pa',
  'west-new-castle-pa',
];

const styledPages = [
  { file: 'index.html', contactId: 'page-contact', includeAreas: false },
  { file: 'mold-remediation/index.html', contactId: 'contact', includeAreas: true },
  { file: 'about/index.html', contactId: 'contact', includeAreas: false },
  { file: '404.html', contactId: 'contact', includeAreas: false },
];

const areas = [
  {
    href: '/',
    title: 'New Castle, PA',
    description:
      'All ZIP codes: 16101, 16102, 16103, 16105, 16107, 16108. Downtown, Neshannock Township, and all New Castle neighborhoods.',
  },
  {
    href: '/oakwood-pa',
    title: 'Oakwood, PA',
    description: 'Homes along West State Street, Sampson Street, and I-376 in Union Township.',
  },
  {
    href: '/oakland-pa',
    title: 'Oakland, PA',
    description: 'Southeastern Union Township communities bordering New Castle.',
  },
  {
    href: '/new-castle-northwest-pa',
    title: 'New Castle Northwest, PA',
    description: 'Wilmington Road area in southern Neshannock Township near UPMC Jameson.',
  },
  {
    href: '/south-new-castle-pa',
    title: 'South New Castle, PA',
    description: 'Shenango Township communities near Big Run and Route 65.',
  },
  {
    href: '/mahoningtown-pa',
    title: 'Mahoningtown, PA',
    description: "New Castle's historic Seventh Ward near Darlington Park, Routes 18 and 108.",
  },
  {
    href: '/east-new-castle-pa',
    title: 'East New Castle, PA',
    description: 'Neshannock Creek corridor, Route 65, and the East Side near Cascade Park.',
  },
  {
    href: '/west-new-castle-pa',
    title: 'West New Castle, PA',
    description: 'West State Street, Sampson Street, and the Shenango River corridor.',
  },
];

const inlineSectionCss = `
    /* Areas we serve + contact form */
    .areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 20px;
      margin-top: 28px;
    }
    a.area-card {
      display: block;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      background: #fafcff;
      border: 1px solid #e3e8f0;
      border-radius: 8px;
      padding: 20px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    a.area-card:hover {
      border-color: #1565c0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    a.area-card h3 { font-size: 16px; margin-bottom: 8px; color: #0d1b4b; }
    a.area-card p { font-size: 14px; color: #555; margin: 0; line-height: 1.5; }
    .contact-section-block {
      background: #f0f4ff;
      padding: 64px 24px;
      max-width: 100%;
    }
    .contact-section-block .section-header {
      max-width: 640px;
      margin: 0 auto;
      text-align: center;
    }
    .contact-section-inner {
      max-width: 520px;
      margin: 28px auto 0;
      background: #fff;
      padding: 28px 24px;
      border-radius: 8px;
      border: 1px solid #e3e8f0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #0d1b4b;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid #d1d9e6;
      border-radius: 6px;
      font-size: 15px;
      color: #1a1a2e;
      background: #fff;
    }
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #1565c0;
      box-shadow: 0 0 0 3px rgba(21,101,192,0.1);
    }
    .form-submit {
      width: 100%;
      padding: 14px;
      background: #b71c1c;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
    }
    .form-submit:hover { background: #d32f2f; }
    .form-privacy {
      font-size: 12px;
      color: #666;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 0;
    }`;

function areaCards(className = 'area-card') {
  return areas
    .map(
      (area) => `      <a class="${className}" href="${area.href}">
        <h3>${area.title}</h3>
        <p>${area.description}</p>
      </a>`
    )
    .join('\n');
}

function contactFormMarkup() {
  return `      <form class="contact-form">
        <div class="form-group">
          <label>Your Name</label>
          <input type="text" name="name" placeholder="John Smith" required>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" placeholder="(724) 555-0100" required>
        </div>
        <div class="form-group">
          <label>ZIP Code</label>
          <input type="text" name="zipcode" placeholder="16101" maxlength="5" required>
        </div>
        <div class="form-group">
          <label>Type of Damage</label>
          <select name="damage_type">
            <option value="">Select damage type...</option>
            <option value="burst_pipe">Burst Pipe</option>
            <option value="basement_flood">Basement Flooding</option>
            <option value="storm_flood">Storm / River Flooding</option>
            <option value="appliance_leak">Appliance Leak</option>
            <option value="sewage">Sewage Backup</option>
            <option value="roof_leak">Roof Leak</option>
            <option value="mold">Mold Discovered</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" class="form-submit">Get Immediate Help →</button>
        <p class="form-privacy">🔒 Your information is private. No spam, ever.</p>
      </form>`;
}

function styledAreasSection() {
  return `<!-- AREAS WE SERVE -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Service Areas</span>
      <h2>Areas we serve</h2>
      <p>We provide water damage restoration throughout New Castle and the neighborhoods below. 60-minute emergency response across the entire service area.</p>
    </div>
    <div class="areas-grid">
${areaCards('area-card')}
    </div>
  </div>
</section>`;
}

function styledContactSection(contactId) {
  return `<!-- SITE CONTACT -->
<section class="section contact-section" id="${contactId}">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Get Help Now</span>
      <h2>Request a Free Water Damage Assessment</h2>
      <p>Fill out the form below and we will call you back within minutes. For emergencies, call our 24/7 line at <a href="tel:+17245588138" class="contact-section-phone">(724) 558-8138</a>.</p>
    </div>
    <div class="contact-section-form">
${contactFormMarkup()}
    </div>
  </div>
</section>`;
}

function inlineAreasSection() {
  return `<!-- AREAS WE SERVE -->
<section style="background:#fff; max-width:100%; padding-left:0; padding-right:0;">
  <div style="max-width:960px; margin:0 auto; padding:64px 24px;">
    <div class="section-label">Service Areas</div>
    <h2>Areas we serve</h2>
    <p>We provide water damage restoration throughout New Castle and the neighborhoods below. 60-minute emergency response across the entire service area.</p>
    <div class="areas-grid">
${areaCards('area-card')}
    </div>
  </div>
</section>`;
}

function inlineContactSection() {
  return `<!-- SITE CONTACT -->
<section class="contact-section-block" id="contact">
  <div style="max-width:960px; margin:0 auto;">
    <div class="section-header">
      <div class="section-label">Get Help Now</div>
      <h2>Request a Free Water Damage Assessment</h2>
      <p>Fill out the form below and we will call you back within minutes. For emergencies, call our 24/7 line at <a href="tel:+17245588138" style="font-weight:700; color:#b71c1c;">(724) 558-8138</a>.</p>
    </div>
    <div class="contact-section-inner">
${contactFormMarkup()}
    </div>
  </div>
</section>`;
}

function removeExistingSections(html) {
  return html
    .replace(/\n?<!-- AREAS WE SERVE -->[\s\S]*?(?=\n<!-- SITE CONTACT -->|\n<!-- FOOTER -->|\n<footer[\s>])/g, '\n')
    .replace(/\n?<!-- SITE CONTACT -->[\s\S]*?(?=\n<!-- FOOTER -->|\n<footer[\s>])/g, '\n');
}

function insertBeforeFooter(html, block) {
  if (html.includes('<!-- SITE CONTACT -->')) {
    html = removeExistingSections(html);
  }
  return html.replace(/(\n\s*<footer[\s>])/i, `\n${block}\n$1`);
}

function ensureInlineSectionCss(html) {
  if (html.includes('/* Areas we serve + contact form */')) return html;
  return html.replace('  </style>', `${inlineSectionCss}\n  </style>`);
}

function ensureMainScript(html) {
  if (html.includes('/js/main.js')) return html;
  if (html.includes('class="call-float"')) {
    return html.replace(
      /<a href="tel:\+17245588138" class="call-float"/,
      '<script src="/js/main.js"></script>\n\n<a href="tel:+17245588138" class="call-float"'
    );
  }
  return html.replace('</body>', '<script src="/js/main.js"></script>\n</body>');
}

for (const slug of serviceSlugs) {
  const file = path.join(root, `${slug}/index.html`);
  let html = fs.readFileSync(file, 'utf8');

  if (slug === 'mold-remediation') {
    const block = `${styledAreasSection()}\n\n${styledContactSection('contact')}`;
    html = insertBeforeFooter(html, block);
    html = ensureMainScript(html);
  } else {
    html = ensureInlineSectionCss(html);
    const block = `${inlineAreasSection()}\n\n${inlineContactSection()}`;
    html = insertBeforeFooter(html, block);
    html = ensureMainScript(html);
  }

  fs.writeFileSync(file, html);
  console.log('updated service:', slug);
}

for (const slug of locationSlugs) {
  const file = path.join(root, `${slug}/index.html`);
  let html = fs.readFileSync(file, 'utf8');
  html = ensureInlineSectionCss(html);
  html = insertBeforeFooter(html, inlineContactSection());
  html = ensureMainScript(html);
  fs.writeFileSync(file, html);
  console.log('updated location:', slug);
}

for (const page of styledPages) {
  if (page.file === 'mold-remediation/index.html') continue;
  const file = path.join(root, page.file);
  let html = fs.readFileSync(file, 'utf8');
  const areasBlock = page.includeAreas ? `${styledAreasSection()}\n\n` : '';
  const block = `${areasBlock}${styledContactSection(page.contactId)}`;
  html = insertBeforeFooter(html, block);
  html = ensureMainScript(html);
  fs.writeFileSync(file, html);
  console.log('updated styled:', page.file);
}
