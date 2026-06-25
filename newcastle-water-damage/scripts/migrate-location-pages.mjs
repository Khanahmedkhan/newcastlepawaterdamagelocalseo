import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const locationFiles = fs
  .readdirSync(root)
  .filter((name) => name.endsWith('-pa.html'));

for (const file of locationFiles) {
  const slug = file.replace(/\.html$/, '');
  const destDir = path.join(root, slug);
  const destFile = path.join(destDir, 'index.html');

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(path.join(root, file), destFile);
  fs.unlinkSync(path.join(root, file));

  console.log('migrated:', slug);
}
