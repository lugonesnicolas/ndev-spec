import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const hash = data => createHash('sha256').update(data).digest('hex');
export function safeParents(target) {
  const absolute = path.resolve(target);
  let current = path.parse(absolute).root;
  for (const part of absolute.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    if (!fs.existsSync(current)) {
      // existsSync returns false for a dangling link.
      try { fs.lstatSync(current); } catch (e) { if (e.code === 'ENOENT') continue; throw e; }
    }
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) throw new Error(`Enlace/junction no admitido: ${current}`);
    if (!stat.isDirectory()) throw new Error(`Directorio requerido: ${current}`);
  }
}

export function inventory(root) {
  const result = new Map();
  if (!fs.existsSync(root)) return result;
  function walk(dir, prefix) {
    for (const name of fs.readdirSync(dir).sort()) {
      if (!prefix && name === '.git') continue;
      const rel = prefix ? `${prefix}/${name}` : name;
      const absolute = path.join(dir, name);
      const stat = fs.lstatSync(absolute);
      if (stat.isSymbolicLink()) result.set(rel, { type: 'link', hash: hash(fs.readlinkSync(absolute)) });
      else if (stat.isDirectory()) { result.set(rel, { type: 'dir' }); walk(absolute, rel); }
      else if (stat.isFile()) result.set(rel, { type: 'file', hash: hash(fs.readFileSync(absolute)), mode: stat.mode & 0o777 });
      else result.set(rel, { type: 'special' });
    }
  }
  walk(root, '');
  return result;
}

export function signature(value) { return JSON.stringify([...value]); }
export function fileState(root, name) {
  safeParents(path.dirname(path.join(root, name)));
  try {
    const stat = fs.lstatSync(path.join(root, name));
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Archivo regular requerido: ${name}`);
    return { data: fs.readFileSync(path.join(root, name)), mode: stat.mode & 0o777 };
  } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export function same(a, b) {
  return a === null || b === null ? a === b : a.data.equals(b.data) &&
    (process.platform === 'win32' || a.mode === b.mode);
}

export function makeDirectories(dir, created) {
  safeParents(dir);
  if (fs.existsSync(dir)) return;
  makeDirectories(path.dirname(dir), created);
  fs.mkdirSync(dir);
  created.push(dir);
}
