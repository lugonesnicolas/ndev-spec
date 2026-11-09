import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { git, OFFICIAL, sourceLocation, resolveCommit, readCanon } from './git.js';
import { provenance, projectText, agentText, textFile } from './context.js';
import { inventory, signature, hash, safeParents, fileState, same, makeDirectories } from './files.js';

function config(root, key) {
  return git(root, ['config', '--get', key], { allowFailure: [1] })?.toString().trim() || '';
}

function gitState(root, isRepo) {
  if (!isRepo) return null;
  const status = git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=all']);
  const flags = git(root, ['ls-files', '-v', '-z']);
  if (flags.toString().split('\0').some(s => s && (s[0] === 'S' || s[0] === s[0].toLowerCase()))) {
    throw new Error('Índice con skip-worktree/assume-unchanged no admitido.');
  }
  if (config(root, 'core.sparseCheckout') === 'true') throw new Error('Sparse checkout no admitido.');
  if (config(root, 'core.bare') === 'true') throw new Error('El destino necesita un árbol de trabajo.');
  const head = git(root, ['rev-parse', '--verify', 'HEAD'], { allowFailure: true })?.toString().trim() || null;
  const index = fs.existsSync(path.join(root, '.git/index')) ? hash(fs.readFileSync(path.join(root, '.git/index'))) : null;
  return { status: status.toString('base64'), head, index,
    config: hash(git(root, ['config', '--null', '--list', '--show-origin'])),
    attributes: fs.existsSync(path.join(root, '.git/info/attributes')) ? hash(fs.readFileSync(path.join(root, '.git/info/attributes'))) : null,
    excludes: fs.existsSync(path.join(root, '.git/info/exclude')) ? hash(fs.readFileSync(path.join(root, '.git/info/exclude'))) : null,
  };
}

function repository(root) {
  let gitStat;
  try { gitStat = fs.lstatSync(path.join(root, '.git')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const hasGit = Boolean(gitStat);
  if (hasGit) {
    if (!gitStat.isDirectory() || gitStat.isSymbolicLink()) throw new Error('Worktree enlazado o .git no regular: no admitido.');
    for (const name of ['HEAD', 'config', 'index', 'info', 'info/attributes', 'info/exclude']) {
      const location = path.join(root, '.git', name);
      try { if (fs.lstatSync(location).isSymbolicLink()) throw new Error(`Metadato Git enlazado no admitido: ${name}`); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
  }
  let existing = root;
  while (!fs.existsSync(existing)) existing = path.dirname(existing);
  const top = git(existing, ['rev-parse', '--show-toplevel'], { allowFailure: [128] });
  if (!top) {
    if (git(existing, ['rev-parse', '--is-bare-repository'], { allowFailure: [128] })?.toString().trim() === 'true') throw new Error('El destino bare no es un proyecto con árbol de trabajo.');
    if (hasGit) throw new Error('El .git existente no es un repositorio válido.');
    return false;
  }
  const actualRoot = path.resolve(top.toString().trim());
  if ((process.platform === 'win32' ? actualRoot.toLowerCase() !== root.toLowerCase() : actualRoot !== root)) {
    throw new Error('El destino está dentro de otro repositorio; ejecutar desde su raíz.');
  }
  return true;
}

function checkNames(inv) {
  for (const name of inv.keys()) {
    const first = name.split('/')[0];
    for (const reserved of ['.ai', 'PROJECT.md', 'AGENTS.md']) {
      if (first.toLowerCase() === reserved.toLowerCase() && first !== reserved) throw new Error(`Colisión de caso: ${first}`);
    }
    if ((first === '.ai' || name === 'PROJECT.md' || name === 'AGENTS.md') &&
        ['link', 'special'].includes(inv.get(name).type)) throw new Error(`Ruta gestionada no regular: ${name}`);
  }
}

function directories(files) {
  const result = new Set();
  for (const name of files.keys()) {
    let parent = path.posix.dirname(name);
    while (parent !== '.') { result.add(parent); parent = path.posix.dirname(parent); }
  }
  return result;
}

function inspectAttributes(repo, names) {
  if (!names.length) return;
  const result = git(repo, ['check-attr', '-z', '--stdin', '--all'], { input: Buffer.from(names.join('\0') + '\0') }).toString().split('\0');
  for (let i = 0; i < result.length - 2; i += 3) {
    const [name, attribute, value] = result.slice(i, i + 3);
    if (['filter', 'ident', 'working-tree-encoding'].includes(attribute) && !['unset', 'unspecified'].includes(value)) {
      throw new Error(`Atributo incompatible ${attribute}=${value}: ${name}`);
    }
    if (attribute === 'eol' && !['lf', 'crlf', 'unset', 'unspecified'].includes(value)) throw new Error(`eol incompatible: ${name}`);
  }
}

function checkAttributes(plan) {
  const names = [...new Set([...plan.targetFiles.keys(), ...(plan.baseFiles?.keys() || []), 'PROJECT.md', 'AGENTS.md'])];
  if (plan.isRepo) inspectAttributes(plan.root, names);
  const proposed = path.join(plan.temp, 'attributes');
  fs.mkdirSync(proposed);
  git(proposed, ['init', '--quiet', `--template=${path.join(plan.temp, 'empty-template')}`]);
  for (const key of ['core.attributesFile', 'core.excludesFile', 'core.autocrlf', 'core.eol']) {
    if (plan.isRepo && config(plan.root, key)) {
      let value = config(plan.root, key);
      if (['core.attributesFile', 'core.excludesFile'].includes(key) && !path.isAbsolute(value) && !value.startsWith('~')) value = path.resolve(plan.root, value);
      git(proposed, ['config', key, value]);
    }
  }
  const attrs = new Map();
  const rootAttr = fileState(plan.root, '.gitattributes');
  if (rootAttr) attrs.set('.gitattributes', rootAttr.data);
  const rootIgnore = fileState(plan.root, '.gitignore');
  if (rootIgnore) attrs.set('.gitignore', rootIgnore.data);
  for (const [name, entry] of plan.targetFiles) if (['.gitattributes', '.gitignore'].includes(path.posix.basename(name))) attrs.set(name, entry.data);
  if (plan.isRepo && fs.existsSync(path.join(plan.root, '.git/info/attributes'))) {
    attrs.set('.git/info/attributes', fs.readFileSync(path.join(plan.root, '.git/info/attributes')));
  }
  for (const [name, data] of attrs) {
    const dest = path.join(proposed, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, data);
  }
  inspectAttributes(proposed, names);
  const ignored = git(proposed, ['check-ignore', '--no-index', '-z', '--stdin'], {
    input: Buffer.from(names.join('\0') + '\0'), allowFailure: [1],
  });
  if (ignored?.length) throw new Error('Ignore del resultado impide rastrear rutas gestionadas.');
  // Guardar resultados efectivos: cambios externos de atributos invalidan la propuesta.
  const current = plan.isRepo ? git(plan.root, ['check-attr', '-z', '--stdin', '--all'], { input: Buffer.from(names.join('\0') + '\0') }) : Buffer.alloc(0);
  return { names, current: hash(current), proposed,
    proposedAttributes: hash(git(proposed, ['check-attr', '-z', '--stdin', '--all'], { input: Buffer.from(names.join('\0') + '\0') })),
    proposedConfig: hash(git(proposed, ['config', '--null', '--list', '--show-origin'])),
  };
}

function equalBase(plan) {
  const expectedDirs = directories(plan.baseFiles);
  const expectedNames = new Set([...plan.baseFiles.keys(), ...expectedDirs]);
  for (const [name, entry] of plan.before) {
    if (name === '.ai' || name.startsWith('.ai/')) {
      if (!expectedNames.has(name)) throw new Error(`Divergencia: contenido desconocido ${name}`);
      if (expectedDirs.has(name) && entry.type !== 'dir') throw new Error(`Divergencia de tipo: ${name}`);
    }
  }
  const index = new Map();
  if (plan.isRepo) {
    const records = git(plan.root, ['ls-files', '--stage', '-z', '--', '.ai']).toString().split('\0').filter(Boolean);
    for (const record of records) {
      const match = /^(\d+) ([a-f0-9]+) (\d)\t([\s\S]+)$/.exec(record);
      if (!match || match[3] !== '0') throw new Error('Índice del canon en conflicto.');
      index.set(match[4], { mode: match[1], oid: match[2], data: git(plan.root, ['cat-file', 'blob', match[2]]) });
    }
  }
  for (const [name, expected] of plan.baseFiles) {
    const actual = fileState(plan.root, name);
    if (!actual) throw new Error(`Divergencia: falta ${name}`);
    if (process.platform !== 'win32' && Boolean(actual.mode & 0o111) !== (expected.mode === '100755')) throw new Error(`Divergencia de modo: ${name}`);
    const staged = index.get(name);
    if (staged && (!staged.data.equals(expected.data) || staged.mode !== expected.mode)) throw new Error(`Divergencia de índice: ${name}`);
    if (actual.data.equals(expected.data)) continue;
    // Solo admitir CRLF uniforme cuando Git demuestra equivalencia con su índice.
    const string = actual.data.toString('utf8');
    const attrs = git(plan.root, ['check-attr', '-z', 'text', 'eol', '--', name]).toString().split('\0');
    const values = new Map();
    for (let i = 0; i < attrs.length - 2; i += 3) values.set(attrs[i + 1], attrs[i + 2]);
    const text = values.get('text');
    const conversion = text !== 'unset' && (text === 'set' || text === 'auto' || ['lf', 'crlf'].includes(values.get('eol')) || ['true', 'input'].includes(config(plan.root, 'core.autocrlf')));
    const normalized = string.replaceAll('\r\n', '\n');
    if (!staged || !conversion || actual.data.includes(0) || !Buffer.from(string).equals(actual.data) ||
        /(?<!\r)\n/.test(string) || normalized.includes('\r') || !Buffer.from(normalized).equals(expected.data)) {
      throw new Error(`Divergencia local: ${name}`);
    }
    // hash-object no escribe ni refresca el índice. Los atributos se validaron antes;
    // solo queda la conversión de líneas que Git debe demostrar contra el blob staged.
    inspectAttributes(plan.root, [name]);
    const converted = git(plan.root, ['hash-object', `--path=${name}`, '--stdin'], { input: actual.data }).toString().trim();
    if (converted !== staged.oid) throw new Error(`Conversión Git no comprobable: ${name}`);
  }
  for (const name of index.keys()) if (!plan.baseFiles.has(name)) throw new Error(`Divergencia de índice: ${name}`);
}

function snapshot(plan) {
  safeParents(plan.root);
  const inv = inventory(plan.root);
  checkNames(inv);
  const isRepo = repository(plan.root);
  if (isRepo) inspectAttributes(plan.root, [...new Set([...inv.keys()].filter(name => name === 'PROJECT.md' || name === 'AGENTS.md' || name.startsWith('.ai/')).concat([...plan.targetFiles.keys()]))]);
  const state = gitState(plan.root, isRepo);
  return { inv, state, exists: fs.existsSync(plan.root) };
}

export function dispose(plan) {
  if (!plan?.temp || plan.recoveryPending) return;
  // Únicamente el temporal que nosotros creamos, nunca el destino ni rutas calculadas del usuario.
  if (path.dirname(plan.temp) !== os.tmpdir() || !path.basename(plan.temp).startsWith('ndev-spec-')) throw new Error('Temporal no reconocido.');
  fs.rmSync(plan.temp, { recursive: true, force: true });
}

export function prepare({ command, directory = '.', source, ref } = {}) {
  if (!['init', 'update'].includes(command)) throw new Error('Comando inválido.');
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES']) {
    if (process.env[key]) throw new Error(`Entorno Git ambiguo: quitar ${key}.`);
  }
  const root = path.resolve(directory);
  safeParents(root);
  const isRepo = repository(root);
  if (command === 'update' && !isRepo) throw new Error('update requiere un repositorio consumidor.');
  const plan = { command, root, isRepo, existed: fs.existsSync(root), before: inventory(root), operations: [] };
  checkNames(plan.before);
  if (isRepo) {
    // status puede invocar clean filters: revisar el canon existente antes de llamarlo.
    inspectAttributes(root, [...plan.before.keys()].filter(name => name === 'PROJECT.md' || name === 'AGENTS.md' || name.startsWith('.ai/')));
  }
  plan.state = gitState(root, isRepo);
  const project = fileState(root, 'PROJECT.md');
  const previous = project ? textFile(project.data, 'PROJECT.md') : null;
  const record = previous === null ? null : provenance(previous);
  if (command === 'update' && !record) throw new Error('Falta procedencia reconocida para actualizar.');
  if (record && source) throw new Error('No se permite cambiar el origen registrado.');
  plan.source = sourceLocation(record?.source || source || OFFICIAL);
  if (record && plan.source !== record.source) throw new Error('Origen registrado no canónico; revisar manualmente.');
  plan.temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ndev-spec-'));
  try {
    const repo = path.join(plan.temp, 'source.git');
    fs.mkdirSync(path.join(plan.temp, 'empty-template'));
    git(plan.temp, ['-c', `core.hooksPath=${path.join(plan.temp, 'empty-template')}`, 'clone', '--bare', '--no-local', '--quiet', `--template=${path.join(plan.temp, 'empty-template')}`, '--', plan.source, repo]);
    plan.revision = resolveCommit(repo, ref || 'HEAD');
    plan.targetFiles = readCanon(repo, plan.revision);
    if (record) {
      // Resolver identidad completa, no aceptar abreviaturas como registro instalado.
      let base;
      try { base = resolveCommit(repo, record.revision); } catch {
        git(repo, ['-c', `core.hooksPath=${path.join(plan.temp, 'empty-template')}`, 'fetch', '--quiet', '--no-tags', '--', plan.source, record.revision]);
        base = resolveCommit(repo, record.revision);
      }
      if (base !== record.revision) throw new Error('La revisión registrada debe ser un OID completo.');
      plan.baseFiles = readCanon(repo, base);
      plan.attributes = checkAttributes(plan);
      equalBase(plan);
      if (command === 'init' && plan.revision !== base) throw new Error('Instalación reconocida: usar update para cambiar revisión.');
    } else if (plan.before.has('.ai')) throw new Error('Colisión: .ai existente sin procedencia reconocida.');
    const agents = fileState(root, 'AGENTS.md');
    const nextAgents = agentText(agents ? textFile(agents.data, 'AGENTS.md') : null, Boolean(record));
    plan.desired = new Map(plan.targetFiles);
    plan.desired.set('PROJECT.md', { data: Buffer.from(projectText(previous, plan.source, plan.revision)), mode: project?.mode || 0o644 });
    plan.desired.set('AGENTS.md', { data: Buffer.from(nextAgents), mode: agents?.mode || 0o644 });
    if (!plan.attributes) plan.attributes = checkAttributes(plan);
    const names = new Set([...(plan.baseFiles?.keys() || []), ...plan.desired.keys()]);
    for (const name of names) {
      const entry = plan.before.get(name);
      const old = !entry || entry.type === 'dir' ? null : fileState(root, name);
      const desired = plan.desired.get(name);
      const next = desired ? { data: desired.data, mode: typeof desired.mode === 'string' ? (desired.mode === '100755' ? 0o755 : 0o644) : desired.mode } : null;
      // Dejar CRLF comprobado sin reescribir en una actualización del mismo blob.
      const base = plan.baseFiles?.get(name);
      if (base && desired && base.data.equals(desired.data) && base.mode === desired.mode) continue;
      if (!same(old, next)) plan.operations.push({ name, before: old, after: next });
    }
    if (plan.operations.length && plan.state?.status) throw new Error('El repositorio tiene cambios: resolverlos antes de instalar o actualizar.');
    if (isRepo) {
      const ignored = git(root, ['check-ignore', '--no-index', '-z', '--stdin'], {
        input: Buffer.from([...plan.desired.keys()].join('\0') + '\0'), allowFailure: [1],
      });
      if (ignored?.length) throw new Error('Ignore impide rastrear rutas gestionadas; resolverlo antes de continuar.');
    }
    // Preparar no modifica destino; también invalida propuestas afectadas durante la descarga.
    const current = snapshot(plan);
    if (current.exists !== plan.existed || signature(current.inv) !== signature(plan.before) || JSON.stringify(current.state) !== JSON.stringify(plan.state)) throw new Error('El destino cambió durante la preparación.');
    return plan;
  } catch (error) { dispose(plan); throw error; }
}

function serializeState(value) { return value ? { data: value.data.toString('base64'), mode: value.mode } : null; }

export function apply(plan, { afterWrite } = {}) {
  const current = snapshot(plan);
  if (current.exists !== plan.existed || signature(current.inv) !== signature(plan.before) || JSON.stringify(current.state) !== JSON.stringify(plan.state)) throw new Error('El destino cambió después de revisar la propuesta.');
  if (plan.isRepo) {
    const attrs = git(plan.root, ['check-attr', '-z', '--stdin', '--all'], { input: Buffer.from(plan.attributes.names.join('\0') + '\0') });
    if (hash(attrs) !== plan.attributes.current) throw new Error('Los atributos cambiaron después de revisar.');
    if (git(plan.root, ['check-ignore', '--no-index', '-z', '--stdin'], {
      input: Buffer.from(plan.attributes.names.join('\0') + '\0'), allowFailure: [1],
    })?.length) throw new Error('Los ignores cambiaron después de revisar.');
  }
  const attrInput = Buffer.from(plan.attributes.names.join('\0') + '\0');
  if (hash(git(plan.attributes.proposed, ['check-attr', '-z', '--stdin', '--all'], { input: attrInput })) !== plan.attributes.proposedAttributes ||
      hash(git(plan.attributes.proposed, ['config', '--null', '--list', '--show-origin'])) !== plan.attributes.proposedConfig ||
      git(plan.attributes.proposed, ['check-ignore', '--no-index', '-z', '--stdin'], { input: attrInput, allowFailure: [1] })?.length) {
    throw new Error('Atributos, configuración o ignores cambiaron después de revisar.');
  }
  if (!plan.operations.length) return { changed: false };
  const manifest = { destination: plan.root, head: plan.state?.head || null, operations: plan.operations.map(op => ({
    name: op.name, before: serializeState(op.before), after: serializeState(op.after),
  })) };
  fs.writeFileSync(path.join(plan.temp, 'recovery.json'), JSON.stringify(manifest, null, 2));
  const created = [], removed = [], attempted = [];
  let repoState;
  try {
    makeDirectories(plan.root, created);
    if (!plan.isRepo) git(plan.root, ['init', '--quiet', `--template=${path.join(plan.temp, 'empty-template')}`]);
    repoState = gitState(plan.root, true);
    // Bajas primero, luego directorios vacíos conocidos, para conversiones archivo/directorio.
    const deletes = plan.operations.filter(op => !op.after).sort((a, b) => b.name.length - a.name.length);
    for (const op of deletes) {
      if (!same(fileState(plan.root, op.name), op.before)) throw new Error(`Cambio concurrente: ${op.name}`);
      attempted.push(op);
      fs.unlinkSync(path.join(plan.root, op.name));
      afterWrite?.(op, plan);
    }
    const desiredDirs = directories(plan.desired);
    for (const [name, entry] of [...plan.before].sort((a, b) => b[0].length - a[0].length)) {
      if (entry.type === 'dir' && (name === '.ai' || name.startsWith('.ai/')) && !desiredDirs.has(name)) {
        safeParents(path.join(plan.root, name));
        fs.rmdirSync(path.join(plan.root, name));
        removed.push(path.join(plan.root, name));
      }
    }
    for (const op of plan.operations.filter(op => op.after)) {
      const dest = path.join(plan.root, op.name);
      makeDirectories(path.dirname(dest), created);
      if (!same(fileState(plan.root, op.name), op.before)) throw new Error(`Cambio concurrente: ${op.name}`);
      attempted.push(op);
      // wx para altas evita reemplazar una ruta aparecida durante la aplicación.
      fs.writeFileSync(dest, op.after.data, { flag: op.before ? 'w' : 'wx', mode: op.after.mode });
      if (process.platform !== 'win32') fs.chmodSync(dest, op.after.mode);
      afterWrite?.(op, plan);
    }
    const final = inventory(plan.root);
    checkNames(final);
    const expectedNames = new Set([...plan.desired.keys(), ...directories(plan.desired)]);
    for (const [name, entry] of final) {
      if ((name === '.ai' || name.startsWith('.ai/')) && !expectedNames.has(name)) throw new Error(`Contenido inesperado: ${name}`);
      if (!expectedNames.has(name) && JSON.stringify(entry) !== JSON.stringify(plan.before.get(name))) throw new Error(`Archivo ajeno cambió: ${name}`);
    }
    for (const [name, entry] of plan.before) {
      if (!expectedNames.has(name) && !(name === '.ai' || name.startsWith('.ai/')) && JSON.stringify(final.get(name)) !== JSON.stringify(entry)) throw new Error(`Archivo ajeno cambió: ${name}`);
    }
    for (const op of plan.operations) {
      if (!op.after && (expectedNames.has(op.name) || [...plan.desired.keys()].some(name => op.name.startsWith(name + '/')))) continue;
      if (!same(fileState(plan.root, op.name), op.after)) throw new Error(`Verificación falló: ${op.name}`);
    }
    const written = new Set(plan.operations.map(op => op.name));
    for (const name of plan.desired.keys()) {
      if (!written.has(name) && JSON.stringify(final.get(name)) !== JSON.stringify(plan.before.get(name))) throw new Error(`Cambio concurrente del canon/contexto: ${name}`);
    }
    for (const [name, entry] of plan.targetFiles) {
      const state = fileState(plan.root, name);
      const base = plan.baseFiles?.get(name);
      if (!state || (!state.data.equals(entry.data) && !(base?.data.equals(entry.data) && !plan.operations.some(op => op.name === name)))) throw new Error(`Canon incompleto: ${name}`);
    }
    inspectAttributes(plan.root, plan.attributes.names);
    if (hash(git(plan.root, ['check-attr', '-z', '--stdin', '--all'], { input: attrInput })) !== plan.attributes.proposedAttributes ||
        git(plan.root, ['check-ignore', '--no-index', '-z', '--stdin'], { input: attrInput, allowFailure: [1] })?.length) throw new Error('Atributos/ignores finales diferentes del resultado revisado.');
    const finalGit = gitState(plan.root, true);
    if (finalGit.head !== repoState.head || finalGit.index !== repoState.index || finalGit.config !== repoState.config || finalGit.attributes !== repoState.attributes || finalGit.excludes !== repoState.excludes) throw new Error('Estado Git cambió durante aplicación.');
    return { changed: true };
  } catch (error) {
    const conflicts = [];
    for (const op of [...attempted].reverse()) {
      try {
        const actual = fileState(plan.root, op.name);
        if (same(actual, op.before)) continue;
        if (!same(actual, op.after)) { conflicts.push(op.name); continue; }
        const dest = path.join(plan.root, op.name);
        if (op.before) {
          makeDirectories(path.dirname(dest), []);
          fs.writeFileSync(dest, op.before.data, { mode: op.before.mode });
          if (process.platform !== 'win32') fs.chmodSync(dest, op.before.mode);
        } else fs.unlinkSync(dest);
      } catch { conflicts.push(op.name); }
    }
    for (const dir of [...created].reverse()) {
      if (dir === plan.root && fs.existsSync(path.join(dir, '.git'))) continue;
      try { fs.rmdirSync(dir); } catch (e) { if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes(e.code)) conflicts.push(dir); }
    }
    for (const dir of [...removed].reverse()) {
      try { makeDirectories(dir, []); } catch { conflicts.push(dir); }
    }
    // Una conversión puede necesitar restaurar una baja después de retirar el nuevo directorio.
    for (const op of attempted.filter(op => op.before && !op.after)) {
      try {
        if (!fs.existsSync(path.join(plan.root, op.name))) {
          makeDirectories(path.dirname(path.join(plan.root, op.name)), []);
          fs.writeFileSync(path.join(plan.root, op.name), op.before.data, { mode: op.before.mode });
          if (process.platform !== 'win32') fs.chmodSync(path.join(plan.root, op.name), op.before.mode);
          const i = conflicts.indexOf(op.name); if (i >= 0) conflicts.splice(i, 1);
        }
      } catch { conflicts.push(op.name); }
    }
    if (conflicts.length) {
      plan.recoveryPending = true;
      throw new Error(`${error.message}\nRecuperación pendiente; preservar cambios posteriores. Respaldo e inventario: ${path.join(plan.temp, 'recovery.json')}`);
    }
    throw new Error(`${error.message}\nArchivos de la operación restaurados; Git inicializado, si corresponde, se conserva.`);
  }
}
