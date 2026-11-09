import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PassThrough, Writable } from 'node:stream';
import { git } from '../lib/git.js';
import { prepare, apply, dispose } from '../lib/installer.js';
import { ADAPTER, provenance } from '../lib/context.js';
import { parse, main } from '../lib/cli.js';

function write(root, name, value) {
  const dest = path.join(root, name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, value);
}
function commit(root, message = 'fixture') {
  git(root, ['add', '--all']);
  git(root, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=', 'commit', '--quiet', '-m', message]);
  return git(root, ['rev-parse', 'HEAD']).toString().trim();
}
function init(root) {
  fs.mkdirSync(root, { recursive: true });
  const template = fs.mkdtempSync(path.join(os.tmpdir(), 'ndev-test-template-'));
  try { git(root, ['init', '--quiet', `--template=${template}`]); }
  finally { fs.rmdirSync(template); }
  git(root, ['config', 'core.autocrlf', 'false']);
}
function fixture(t) {
  const temp = fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), 'ndev-test-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));
  const source = path.join(temp, 'source with spaces');
  const target = path.join(temp, 'consumer with spaces');
  init(source);
  for (const [name, data] of Object.entries({
    '.ai/README.md': '# Canon\n', '.ai/workflow.md': '# Workflow\n',
    '.ai/skills/constitution/SKILL.md': '# constitution\n',
    '.ai/.hidden': 'hidden\n', '.ai/rules/.gitkeep': '',
  })) write(source, name, data);
  const base = commit(source);
  const make = (options = {}) => {
    const plan = prepare({ command: 'init', directory: target, source, ...options });
    t.after(() => { plan.recoveryPending = false; dispose(plan); });
    return plan;
  };
  return { temp, source, target, base, make };
}
function installed(t) {
  const f = fixture(t);
  const plan = f.make();
  apply(plan);
  commit(f.target);
  return f;
}
function update(f, ref) {
  return f.make({ command: 'update', source: undefined, ref });
}

test('parser estricto y ayuda', () => {
  assert.deepEqual(parse(['init', '.', '--ref', 'v1', '--yes']), { command: 'init', directory: '.', ref: 'v1', yes: true });
  assert.equal(parse([]).help, true);
  for (const argv of [['init', '--force'], ['update', '--source', 'x'], ['init', '--ref'], ['init', 'a', 'b'], ['init', '--yes', '--yes']]) assert.throws(() => parse(argv));
});

test('proyecto nuevo: canon exacto, ocultos, contexto pendiente y sin commits ni stage', t => {
  const f = fixture(t), plan = f.make();
  assert.equal(fs.existsSync(f.target), false);
  assert.equal(plan.revision, f.base);
  apply(plan);
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/.hidden'), 'utf8'), 'hidden\n');
  assert.equal(fs.existsSync(path.join(f.target, '.ai/rules/.gitkeep')), true);
  assert.equal(fs.readFileSync(path.join(f.target, 'AGENTS.md'), 'utf8'), ADAPTER);
  const project = fs.readFileSync(path.join(f.target, 'PROJECT.md'), 'utf8');
  assert.equal(provenance(project).revision, f.base);
  assert.match(project, /Pendiente/);
  assert.equal(git(f.target, ['rev-parse', '--verify', 'HEAD'], { allowFailure: true }), null);
  assert.equal(git(f.target, ['ls-files']).length, 0);
});

test('existente: preservar bytes de contexto, instrucciones, specs y código', t => {
  const f = fixture(t); init(f.target);
  const project = '# Mi app\r\n\r\n## Entrega\r\n\r\nPR manual.\r\n';
  const agents = '# Reglas propias\r\n\r\nUsar pruebas locales.\r\n';
  write(f.target, 'PROJECT.md', project); write(f.target, 'AGENTS.md', agents);
  write(f.target, 'src/app.js', 'own code\n'); write(f.target, 'specs/001-own/spec.md', 'own spec');
  const head = commit(f.target);
  const plan = f.make(); apply(plan);
  assert.ok(fs.readFileSync(path.join(f.target, 'PROJECT.md'), 'utf8').startsWith(project));
  assert.ok(fs.readFileSync(path.join(f.target, 'AGENTS.md'), 'utf8').startsWith(agents));
  assert.equal(fs.readFileSync(path.join(f.target, 'src/app.js'), 'utf8'), 'own code\n');
  assert.equal(git(f.target, ['rev-parse', 'HEAD']).toString().trim(), head);
  assert.equal(git(f.target, ['diff', '--cached']).length, 0);
});

test('update altas, modificaciones, bajas, no-op y retroceso explícito', t => {
  const f = installed(t);
  write(f.source, '.ai/README.md', '# Updated\n'); write(f.source, '.ai/new.md', 'new\n');
  fs.unlinkSync(path.join(f.source, '.ai/.hidden'));
  const next = commit(f.source);
  const plan = update(f); apply(plan);
  assert.deepEqual(plan.operations.filter(op => op.name.startsWith('.ai/')).map(op => op.name).sort(), ['.ai/.hidden', '.ai/README.md', '.ai/new.md']);
  assert.equal(provenance(fs.readFileSync(path.join(f.target, 'PROJECT.md'), 'utf8')).revision, next);
  commit(f.target);
  assert.equal(apply(update(f)).changed, false);
  apply(update(f, f.base));
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/.hidden'), 'utf8'), 'hidden\n');
  assert.equal(fs.existsSync(path.join(f.target, '.ai/new.md')), false);
});

test('divergencia confirmada y contenido ignorado bloquean sin escribir', t => {
  const f = installed(t);
  write(f.target, '.ai/README.md', '# Local\n'); commit(f.target);
  assert.throws(() => update(f), /Divergencia/);
  write(f.target, '.ai/README.md', '# Canon\n'); write(f.target, '.gitignore', '.ai/private.md\n'); commit(f.target);
  write(f.target, '.ai/private.md', 'secret local');
  assert.throws(() => update(f), /desconocido/);
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/private.md'), 'utf8'), 'secret local');
});

test('colisiones sin instalación reconocida, incluso ignoradas', t => {
  const f = fixture(t); init(f.target);
  write(f.target, '.gitignore', '.ai/\n'); commit(f.target);
  write(f.target, '.ai/existing.md', 'keep');
  assert.throws(() => f.make(), /Colisión/);
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/existing.md'), 'utf8'), 'keep');
});

test('índice y árbol sucios bloquean, sin stash ni commits', t => {
  const f = fixture(t); init(f.target);
  write(f.target, 'app', 'base'); const head = commit(f.target);
  write(f.target, 'app', 'new');
  assert.throws(() => f.make(), /tiene cambios/);
  git(f.target, ['add', '--', 'app']);
  assert.throws(() => f.make(), /tiene cambios/);
  assert.equal(git(f.target, ['rev-parse', 'HEAD']).toString().trim(), head);
  assert.match(git(f.target, ['diff', '--cached']).toString(), /new/);
});

test('atributos actuales y propuestos incompatibles bloquean sin ejecutar filtros', t => {
  const f = fixture(t); init(f.target);
  write(f.target, '.gitattributes', '.ai/** filter=untrusted\n'); commit(f.target);
  git(f.target, ['config', 'filter.untrusted.smudge', 'THIS_MUST_NOT_EXECUTE']);
  assert.throws(() => f.make(), /Atributo incompatible/);
  fs.unlinkSync(path.join(f.target, '.gitattributes')); commit(f.target);
  write(f.source, '.ai/.gitattributes', '* working-tree-encoding=UTF-16\n');
  // Git add interpretaría encoding: agregar .gitattributes después del resto del canon.
  const attrBlob = git(f.source, ['hash-object', '-w', '--stdin'], { input: Buffer.from('* working-tree-encoding=UTF-16\n') }).toString().trim();
  git(f.source, ['update-index', '--add', '--cacheinfo', `100644,${attrBlob},.ai/.gitattributes`]);
  git(f.source, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=', 'commit', '--quiet', '-m', 'attrs']);
  assert.throws(() => f.make(), /Atributo incompatible/);
});

test('ignores de rutas nuevas bloquean antes de aplicar', t => {
  const f = fixture(t); init(f.target);
  write(f.target, '.gitignore', 'PROJECT.md\n'); commit(f.target);
  assert.throws(() => f.make(), /Ignore/);
  assert.equal(fs.existsSync(path.join(f.target, '.ai')), false);
});

test('procedencia duplicada, abreviada o bloque alterado bloquean update', t => {
  const f = installed(t), projectPath = path.join(f.target, 'PROJECT.md');
  const original = fs.readFileSync(projectPath, 'utf8');
  write(f.target, 'PROJECT.md', original + '\n## ndev-spec\n'); commit(f.target);
  assert.throws(() => update(f), /duplicada/);
  write(f.target, 'PROJECT.md', original.replace(f.base, f.base.slice(0, 8))); commit(f.target);
  assert.throws(() => update(f), /OID completo/);
  write(f.target, 'PROJECT.md', original); write(f.target, 'AGENTS.md', ADAPTER.replace('Antes', 'Después')); commit(f.target);
  assert.throws(() => update(f), /bloque gestionado/);
});

test('conflicto explícito en instrucciones bloquea init', t => {
  const f = fixture(t); init(f.target);
  write(f.target, 'AGENTS.md', 'No leer .ai en este proyecto.\n'); commit(f.target);
  assert.throws(() => f.make(), /conflicto/);
});

test('revalidación detecta cambios posteriores a la propuesta', t => {
  const f = fixture(t); init(f.target);
  write(f.target, 'app', 'base'); commit(f.target);
  const plan = f.make(); write(f.target, 'app', 'concurrent');
  assert.throws(() => apply(plan), /cambió después/);
  assert.equal(fs.existsSync(path.join(f.target, '.ai')), false);
});

test('fallo inyectado restaura solo las rutas propias', t => {
  const f = fixture(t); init(f.target);
  write(f.target, 'app', 'keep'); commit(f.target);
  const plan = f.make();
  assert.throws(() => apply(plan, { afterWrite() { throw new Error('interrupción simulada'); } }), /restaurados/);
  assert.equal(fs.existsSync(path.join(f.target, '.ai')), false);
  assert.equal(fs.readFileSync(path.join(f.target, 'app'), 'utf8'), 'keep');
  assert.equal(git(f.target, ['status', '--porcelain']).length, 0);
});

test('cambio concurrente de una escritura conserva respaldo y contenido posterior', t => {
  const f = fixture(t), plan = f.make();
  let changed;
  assert.throws(() => apply(plan, { afterWrite(op) {
    changed = op.name; write(f.target, op.name, 'concurrent'); throw new Error('interrupción');
  } }), /Recuperación pendiente/);
  assert.equal(fs.readFileSync(path.join(f.target, changed), 'utf8'), 'concurrent');
  assert.equal(fs.existsSync(path.join(plan.temp, 'recovery.json')), true);
});

test('conversión archivo/directorio y regreso preservan el resto', t => {
  const f = installed(t);
  fs.unlinkSync(path.join(f.source, '.ai/.hidden'));
  write(f.source, '.ai/.hidden/child', 'child'); commit(f.source);
  apply(update(f)); commit(f.target);
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/.hidden/child'), 'utf8'), 'child');
  apply(update(f, f.base));
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/.hidden'), 'utf8'), 'hidden\n');
});

test('symlink/junction del destino o canon del origen se rechaza', t => {
  const f = fixture(t);
  const linked = path.join(f.temp, 'linked');
  fs.symlinkSync(f.source, linked, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => f.make({ directory: linked }), /Enlace/);
  // Crear symlink en el árbol Git sin requerir privilegios del SO.
  const blob = git(f.source, ['hash-object', '-w', '--stdin'], { input: Buffer.from('README.md') }).toString().trim();
  git(f.source, ['update-index', '--add', '--cacheinfo', `120000,${blob},.ai/link`]);
  git(f.source, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=', 'commit', '--quiet', '-m', 'link']);
  assert.throws(() => f.make(), /Tipo de ruta/);
});

test('colisión de caso y rutas incompatibles del origen se rechazan', t => {
  const f = fixture(t);
  const blob = git(f.source, ['hash-object', '-w', '--stdin'], { input: Buffer.from('x') }).toString().trim();
  git(f.source, ['update-index', '--add', '--cacheinfo', `100644,${blob},.ai/readme.md`]);
  git(f.source, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=', 'commit', '--quiet', '-m', 'case']);
  assert.throws(() => f.make(), /Colisión de caso/);
});

test('origen inexistente y credenciales se rechazan antes de escribir', t => {
  const f = fixture(t);
  assert.throws(() => f.make({ source: path.join(f.temp, 'absent') }), /inexistente/);
  assert.throws(() => f.make({ source: 'https://token@example.invalid/repo.git' }), /sin credenciales/);
  assert.equal(fs.existsSync(f.target), false);
});

test('CLI dry-run y cancelación conservan destino; aceptación muestra constitution', async t => {
  const f = fixture(t);
  const input = new PassThrough(); input.isTTY = true;
  let output = '';
  const out = new Writable({ write(chunk, encoding, callback) { output += chunk; callback(); } }); out.isTTY = true;
  const args = ['init', f.target, '--source', f.source];
  await main([...args, '--dry-run'], { stdin: input, stdout: out, stderr: out });
  assert.equal(fs.existsSync(f.target), false);
  assert.match(output, /Revisión:/);
  assert.match(output, /Simulación: no se aplicaron cambios/);
  assert.doesNotMatch(output, /\+# Canon/);
  await main([...args, '--dry-run', '--diff'], { stdin: input, stdout: out, stderr: out });
  assert.match(output, /\+# Canon/);
  assert.equal(fs.existsSync(f.target), false);
  const pending = main(args, { stdin: input, stdout: out, stderr: out });
  input.write('n\n'); await pending;
  assert.match(output, /Cancelado/);
  assert.equal(fs.existsSync(f.target), false);
  await main([...args, '--yes'], { stdin: input, stdout: out, stderr: out });
  assert.match(output, /Commit pendiente/); assert.match(output, /constitution/);
});

test('init repetido sin commit es no-op y no altera el índice', t => {
  const f = fixture(t); apply(f.make());
  const explicit = f.make();
  assert.equal(explicit.operations.length, 0);
  assert.equal(apply(explicit).changed, false);
  const plan = f.make({ source: undefined });
  assert.equal(plan.operations.length, 0);
  assert.equal(apply(plan).changed, false);
  assert.equal(git(f.target, ['ls-files']).length, 0);
});

test('init reconoce ruta equivalente del origen pero bloquea otro origen', t => {
  const f = fixture(t); apply(f.make());
  const before = git(f.target, ['status', '--porcelain=v1', '-z']);
  const equivalent = f.make({ source: `${f.source}${path.sep}..${path.sep}${path.basename(f.source)}` });
  assert.equal(apply(equivalent).changed, false);
  assert.throws(() => f.make({ source: f.temp }), /No se permite cambiar el origen registrado/);
  write(f.source, 'next-revision.txt', 'sin cambios del canon'); commit(f.source);
  assert.throws(() => f.make(), /usar update para cambiar revisión/);
  assert.equal(apply(f.make({ ref: f.base })).changed, false);
  assert.deepEqual(git(f.target, ['status', '--porcelain=v1', '-z']), before);
  assert.equal(git(f.target, ['ls-files']).length, 0);
});

test('solo procedencia cambia si el commit cambia sin cambiar canon', t => {
  const f = installed(t);
  write(f.source, 'unrelated.txt', 'outside canon'); const next = commit(f.source);
  const plan = update(f);
  assert.deepEqual(plan.operations.map(op => op.name), ['PROJECT.md']);
  apply(plan);
  assert.equal(provenance(fs.readFileSync(path.join(f.target, 'PROJECT.md'), 'utf8')).revision, next);
});

test('CRLF comprobable se conserva y cambios mixtos se rechazan', t => {
  const f = installed(t);
  git(f.target, ['config', 'core.autocrlf', 'true']);
  write(f.target, '.ai/README.md', '# Canon\r\n');
  // Git comprueba la conversión contra el blob del índice.
  const plan = update(f);
  assert.equal(plan.operations.length, 0);
  apply(plan);
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/README.md'), 'utf8'), '# Canon\r\n');
  write(f.target, '.ai/README.md', '# Canon\r\nextra\n');
  assert.throws(() => update(f), /Divergencia/);
});

test('update preserva prefijo/sufijo CRLF de PROJECT e instrucciones externas', t => {
  const f = installed(t);
  const own = '# App\r\n\r\n';
  const suffix = '\r\n\r\n## Otro contrato\r\n\r\nConservar bytes.\r\n';
  write(f.target, 'PROJECT.md', own + `## ndev-spec\r\n\r\n- Origen: ${f.source}\r\n- Revisión: ${f.base}` + suffix);
  write(f.target, 'AGENTS.md', '# Propio\r\n\r\n' + ADAPTER.replaceAll('\n', '\r\n') + '\r\n## Más\r\n');
  commit(f.target);
  write(f.source, '.ai/new', 'new'); commit(f.source);
  const beforeAgents = fs.readFileSync(path.join(f.target, 'AGENTS.md'));
  apply(update(f));
  const result = fs.readFileSync(path.join(f.target, 'PROJECT.md'), 'utf8');
  assert.ok(result.startsWith(own)); assert.ok(result.endsWith(suffix));
  assert.deepEqual(fs.readFileSync(path.join(f.target, 'AGENTS.md')), beforeAgents);
});

test('sparse checkout y flags de índice ocultan cambios: bloquear', t => {
  const f = installed(t);
  git(f.target, ['update-index', '--assume-unchanged', '.ai/README.md']);
  assert.throws(() => update(f), /assume-unchanged/);
  git(f.target, ['update-index', '--no-assume-unchanged', '.ai/README.md']);
  git(f.target, ['config', 'core.sparseCheckout', 'true']);
  assert.throws(() => update(f), /Sparse/);
});

test('un filtro del canon modificado no se ejecuta ni durante status', t => {
  const f = installed(t);
  write(f.target, '.gitattributes', '.ai/** filter=tripwire\n'); commit(f.target);
  git(f.target, ['config', 'filter.tripwire.clean', 'THIS_MUST_NOT_EXECUTE']);
  git(f.target, ['config', 'filter.tripwire.required', 'true']);
  write(f.target, '.ai/README.md', 'dirty');
  assert.throws(() => update(f), /Atributo incompatible/);
});

test('cambio concurrente de archivo gestionado sin actualización no se oculta', t => {
  const f = installed(t);
  write(f.source, '.ai/new', 'new'); commit(f.source);
  const plan = update(f);
  assert.throws(() => apply(plan, { afterWrite() {
    write(f.target, '.ai/README.md', 'concurrent');
  } }), /Cambio concurrente/);
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/README.md'), 'utf8'), 'concurrent');
  assert.equal(fs.existsSync(path.join(f.target, '.ai/new')), false);
});

test('fallo durante conversión archivo/directorio restaura la base', t => {
  const f = installed(t);
  fs.unlinkSync(path.join(f.source, '.ai/.hidden'));
  write(f.source, '.ai/.hidden/child', 'child'); commit(f.source);
  const plan = update(f);
  assert.throws(() => apply(plan, { afterWrite(op) { if (op.after) throw new Error('fail'); } }), /restaurados/);
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/.hidden'), 'utf8'), 'hidden\n');
  assert.equal(git(f.target, ['status', '--porcelain']).length, 0);
});

test('un repositorio creado después de revisar invalida init', t => {
  const f = fixture(t), plan = f.make();
  init(f.target);
  assert.throws(() => apply(plan), /cambió después/);
  assert.equal(fs.existsSync(path.join(f.target, '.ai')), false);
});

test('atributos o ignores cambiados después de revisar bloquean antes de escribir', t => {
  const f = installed(t);
  write(f.source, '.ai/new', 'new'); commit(f.source);
  const plan = update(f);
  write(f.target, '.git/info/exclude', 'PROJECT.md\n');
  assert.throws(() => apply(plan), /cambió después/);
  assert.equal(fs.existsSync(path.join(f.target, '.ai/new')), false);
  write(f.target, '.git/info/exclude', '');
  const nextPlan = update(f);
  write(f.target, '.git/info/attributes', '.ai/** filter=tripwire\n');
  assert.throws(() => apply(nextPlan), /Atributo incompatible/);
  assert.equal(fs.existsSync(path.join(f.target, '.ai/new')), false);
});

test('commit con export-ignore/export-subst conserva blobs exactos', t => {
  const f = fixture(t);
  write(f.source, '.gitattributes', '.ai/** export-ignore export-subst\n');
  write(f.source, '.ai/subst', '$Format:%H$\n'); commit(f.source);
  apply(f.make());
  assert.equal(fs.readFileSync(path.join(f.target, '.ai/subst'), 'utf8'), '$Format:%H$\n');
});

test('objetos SHA-256 se comprueban por contenido sin asumir OID SHA-1', t => {
  const f = fixture(t), source256 = path.join(f.temp, 'sha256');
  fs.mkdirSync(source256);
  git(source256, ['init', '--quiet', '--object-format=sha256']);
  git(source256, ['config', 'core.autocrlf', 'false']);
  fs.cpSync(path.join(f.source, '.ai'), path.join(source256, '.ai'), { recursive: true });
  const oid = commit(source256);
  const plan = f.make({ source: source256 });
  assert.equal(plan.revision, oid);
  apply(plan); commit(f.target);
  assert.equal(update(f).operations.length, 0);
});

test('CLI no interactiva exige --yes sin mutar', async t => {
  const f = fixture(t), input = new PassThrough();
  let output = '';
  const out = new Writable({ write(chunk, encoding, callback) { output += chunk; callback(); } });
  const exit = process.exitCode;
  try {
    await main(['init', f.target, '--source', f.source], { stdin: input, stdout: out, stderr: out });
    assert.match(output, /Sin terminal interactiva/);
    assert.equal(fs.existsSync(f.target), false);
  } finally { process.exitCode = exit; }
});

test('blobs binarios y modos representables se conservan', t => {
  const f = fixture(t);
  const binary = Buffer.from([0, 255, 13, 10, 128]);
  write(f.source, '.ai/data.bin', binary); commit(f.source);
  apply(f.make()); commit(f.target);
  assert.deepEqual(fs.readFileSync(path.join(f.target, '.ai/data.bin')), binary);
  git(f.source, ['update-index', '--chmod=+x', '.ai/data.bin']);
  git(f.source, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=', 'commit', '--quiet', '-m', 'executable']);
  if (process.platform === 'win32') assert.throws(() => update(f), /Modo ejecutable no representable/);
  else {
    apply(update(f));
    assert.ok(fs.statSync(path.join(f.target, '.ai/data.bin')).mode & 0o111);
  }
});

test('destino bare y metadato .git enlazado no se reinicializan', t => {
  const f = fixture(t);
  git(f.temp, ['-c', 'core.hooksPath=', 'clone', '--bare', '--quiet', '--', f.source, f.target]);
  assert.throws(() => f.make(), /destino bare/);
  assert.equal(fs.existsSync(path.join(f.target, '.git')), false);
  const other = path.join(f.temp, 'linked metadata');
  fs.mkdirSync(other);
  fs.symlinkSync(path.join(f.temp, 'missing metadata'), path.join(other, '.git'), process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => f.make({ directory: other }), /\.git no regular/);
});

test('raíz física equivalente de Git se acepta y subdirectorio se rechaza', t => {
  const f = fixture(t); init(f.target);
  write(f.target, 'app', 'base'); commit(f.target);
  const destination = process.platform === 'win32'
    ? path.join(os.tmpdir(), path.basename(f.temp), path.basename(f.target)) : f.target;
  const proposal = f.make({ directory: destination });
  assert.ok(proposal.operations.length > 0);
  assert.equal(fs.existsSync(path.join(f.target, '.ai')), false);
  const child = path.join(f.target, 'subdirectory');
  fs.mkdirSync(child);
  assert.throws(() => f.make({ directory: child }), /dentro de otro repositorio/);
});
