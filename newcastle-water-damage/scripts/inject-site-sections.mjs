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
  {
    href: '/downtown-new-castle-pa',
    title: 'Downtown New Castle, PA',
    description: 'Shenango River and Neshannock Creek confluence, Zambelli Park, and the Riverplex corridor.',
  },
  {
    href: '/neshannock-township-pa',
    title: 'Neshannock Township, PA',
    description: 'Walmo, Coaltown, Painter Hill, Kings Chapel, and Pearson Park areas.',
  },
  {
    href: '/north-hill-pa',
    title: 'North Hill, PA',
    description: "New Castle's National Register Historic District near Lincoln and Boyles Avenues.",
  },
  {
    href: '/shenango-township-pa',
    title: 'Shenango Township, PA',
    description: 'Cascade Park, Chewton, Route 65, and Shenango Township communities.',
  },
  {
    href: '/union-township-pa',
    title: 'Union Township, PA',
    description: 'Oakwood, Oakland, Harbor, Belmar Park, and Parkstown communities.',
  },
  {
    href: '/bessemer-pa',
    title: 'Bessemer, PA',
    description: 'Historic limestone and cement borough near the Ohio state line in Lawrence County.',
  },
  {
    href: '/hermitage-pa',
    title: 'Hermitage, PA',
    description: "Mercer County city near Buhl Park, East State Street, and Shenango River Lake.",
  },
  {
    href: '/north-beaver-township-pa',
    title: 'North Beaver Township, PA',
    description: 'Mount Jackson, Bessemer, Moravia, and Ohio border communities in Lawrence County.',
  },
  {
    href: '/taylor-township-pa',
    title: 'Taylor Township, PA',
    description: 'West Pittsburg and Taylor Township communities throughout Lawrence County.',
  },
  {
    href: '/wampum-pa',
    title: 'Wampum, PA',
    description: "Lawrence County's oldest borough on the Beaver River — Eckles Run and Main Street.",
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

const callFloatCss = `
    /* Floating call button */
    .call-float {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #b71c1c;
      color: #fff;
      padding: 14px 22px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 15px;
      line-height: 1;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(183, 28, 28, 0.45);
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }
    .call-float:hover {
      background: #d32f2f;
      color: #fff;
      text-decoration: none;
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(183, 28, 28, 0.55);
    }
    .call-float-icon {
      display: inline-flex;
      align-items: center;
      line-height: 1;
    }
    .call-float-icon svg {
      width: 1.25rem;
      height: 1.25rem;
      fill: currentColor;
    }
    @media (max-width: 480px) {
      .call-float {
        bottom: 16px;
        right: 16px;
        padding: 14px 18px;
        font-size: 14px;
      }
    }`;

function ensureInlineSectionCss(html) {
  let next = html;
  if (!next.includes('/* Floating call button */')) {
    next = next.replace('  </style>', `${callFloatCss}\n  </style>`);
  }
  if (next.includes('/* Areas we serve + contact form */')) return next;
  return next.replace('  </style>', `${inlineSectionCss}\n  </style>`);
}

const callFloatWidget = `<a href="tel:+17245588138" class="call-float" aria-label="Call now — (724) 558-8138">
  <span class="call-float-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></span>
  <span class="call-float-text">Call Now</span>
</a>`;

function ensureMainScript(html) {
  let next = html;
  if (!next.includes('/js/main.js')) {
    next = next.replace('</body>', `<script src="/js/main.js"></script>\n\n${callFloatWidget}\n</body>`);
  } else if (!next.includes('class="call-float"')) {
    next = next.replace('</body>', `\n${callFloatWidget}\n</body>`);
  }
  return next;
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
  const block = `${inlineAreasSection()}\n\n${inlineContactSection()}`;
  html = insertBeforeFooter(html, block);
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
