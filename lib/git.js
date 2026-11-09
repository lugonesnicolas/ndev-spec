import { execFileSync } from 'node:child_process';
import { existsSync, realpathSync, lstatSync } from 'node:fs';
import path from 'node:path';

export const OFFICIAL = 'https://github.com/lugonesnicolas/ndev-spec.git';

// No shell, checkout, archive, hooks ni filtros del origen.
export function git(cwd, args, { input, env = {}, allowFailure = false } = {}) {
  try {
    return execFileSync('git', ['-c', 'protocol.ext.allow=never', '-c', 'protocol.file.allow=always', ...args], {
      cwd, input, maxBuffer: 128 * 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0', ...env },
      stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true,
    });
  } catch (error) {
    const allowed = Array.isArray(allowFailure) ? allowFailure : allowFailure ? [1, 128] : [];
    if (allowed.includes(error.status)) return null;
    const detail = (error.stderr?.toString().trim() || error.message).replace(/(https?:\/\/)[^\s/@]+(?::[^\s/@]*)?@/g, '$1[credenciales]@');
    throw new Error(`Git (${args[0]}) falló: ${detail}`);
  }
}

export function sourceLocation(value) {
  if (!value || value.startsWith('-') || /[\r\n\0]/.test(value)) throw new Error('Origen inválido.');
  if (existsSync(value)) {
    if (!lstatSync(value).isDirectory()) throw new Error('El origen local debe ser un repositorio.');
    return realpathSync(value);
  }
  if (path.isAbsolute(value) || value.startsWith('.')) throw new Error('Origen local inexistente.');
  // Limitar transportes: no remote helpers arbitrarios ni credenciales embebidas.
  if (/^git@[^\s:]+:[^\s]+$/.test(value)) return value;
  let url;
  try { url = new URL(value); } catch { throw new Error('Origen local inexistente o URL no admitida.'); }
  if (!['https:', 'http:', 'ssh:'].includes(url.protocol) || url.password ||
      (url.username && !(url.protocol === 'ssh:' && url.username === 'git')) || url.search || url.hash) {
    throw new Error('Origen no admitido; usar ruta local o URL Git sin credenciales.');
  }
  return value;
}

export function resolveCommit(repo, reference) {
  if (!reference || reference.startsWith('-') || /[\s\0]/.test(reference)) throw new Error('Referencia inválida.');
  const oid = git(repo, ['rev-parse', '--verify', '--end-of-options', `${reference}^{commit}`]).toString().trim();
  if (!/^[a-f0-9]+$/.test(oid)) throw new Error('No se resolvió un commit completo.');
  return oid;
}

export function portablePath(name) {
  const parts = name.split('/');
  if (parts.some(p => !p || p === '.' || p === '..' || /[\x00-\x1f\x7f\\:<>"|?*]/.test(p) ||
      /[. ]$/.test(p) || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(p) ||
      /^\.git(?:\.|$)/i.test(p) || p !== p.normalize('NFC'))) throw new Error(`Ruta no portable: ${name}`);
}

export function readCanon(repo, oid) {
  const tree = git(repo, ['ls-tree', '-rz', '--full-tree', oid, '--', '.ai']);
  if (!Buffer.from(tree.toString('utf8')).equals(tree)) throw new Error('Rutas Git no UTF-8.');
  const files = new Map();
  const folded = new Map();
  for (const raw of tree.toString('utf8').split('\0').filter(Boolean)) {
    const match = /^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/.exec(raw);
    if (!match) throw new Error('Árbol Git inválido.');
    const [, mode, type, blob, name] = match;
    portablePath(name);
    if (!name.startsWith('.ai/') || type !== 'blob' || !['100644', '100755'].includes(mode)) {
      throw new Error(`Tipo de ruta no admitido: ${name}`);
    }
    if (process.platform === 'win32' && mode === '100755') throw new Error(`Modo ejecutable no representable: ${name}`);
    // Incluir directorios en el control de colisiones entre mayúsculas/minúsculas.
    const parts = name.split('/');
    for (let i = 1; i <= parts.length; i++) {
      const part = parts.slice(0, i).join('/');
      const lower = part.toLowerCase();
      if (folded.has(lower) && folded.get(lower) !== part) throw new Error(`Colisión de caso: ${part}`);
      folded.set(lower, part);
    }
    const data = git(repo, ['cat-file', 'blob', blob]);
    const actual = git(repo, ['hash-object', '--stdin'], { input: data }).toString().trim();
    if (actual !== blob) throw new Error(`Blob no comprobado: ${name}`);
    files.set(name, { data, mode });
  }
  if (!files.has('.ai/README.md') || !files.has('.ai/workflow.md') || !files.has('.ai/skills/constitution/SKILL.md')) {
    throw new Error('El origen no contiene un canon ndev-spec completo.');
  }
  return files;
}
