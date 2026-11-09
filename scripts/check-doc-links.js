import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory() && !['.git', 'node_modules'].includes(entry.name)) walk(name);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(name);
  }
}
walk(root);
function anchors(file) {
  const counts = new Map(), result = new Set();
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/^#{1,6} (.+)$/gm)) {
    const base = match[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\p{M}_ -]/gu, '').replaceAll(' ', '-');
    const count = counts.get(base) || 0; counts.set(base, count + 1);
    result.add(base + (count ? `-${count}` : ''));
  }
  return result;
}
const errors = []; let checked = 0;
for (const file of files) {
  for (const match of fs.readFileSync(file, 'utf8').matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    const value = match[1];
    if (/^[a-z][\w+.-]*:/i.test(value)) continue;
    const [relative, fragment] = value.split('#');
    const target = relative ? path.resolve(path.dirname(file), decodeURIComponent(relative)) : file;
    checked++;
    if (!fs.existsSync(target)) errors.push(`${path.relative(root, file)}: destino inexistente ${value}`);
    else if (fragment && target.endsWith('.md') && !anchors(target).has(decodeURIComponent(fragment))) errors.push(`${path.relative(root, file)}: ancla inexistente ${value}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`${checked} enlaces locales comprobados en ${files.length} Markdown: OK.`);
