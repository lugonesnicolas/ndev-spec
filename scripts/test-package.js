import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { git } from '../lib/git.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const temp = fs.mkdtempSync(path.join(fs.realpathSync.native(os.tmpdir()), 'ndev-package-'));
function npmCli() {
  if (process.env.npm_execpath && fs.existsSync(process.env.npm_execpath)) return process.env.npm_execpath;
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    const candidates = [path.join(dir, 'node_modules/npm/bin/npm-cli.js')];
    const executable = path.join(dir, 'npm');
    if (fs.existsSync(executable)) candidates.push(fs.realpathSync(executable));
    for (const candidate of candidates) if (candidate.endsWith('.js') && fs.existsSync(candidate)) return candidate;
  }
  throw new Error('No se encontró npm-cli.js en PATH.');
}
const npm = npmCli();
const env = { ...process.env, PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
  npm_config_cache: path.join(temp, 'cache'), npm_config_update_notifier: 'false', npm_config_audit: 'false', npm_config_fund: 'false' };
function run(args, cwd = temp) {
  return execFileSync(process.execPath, [npm, ...args], { cwd, env, windowsHide: true, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}
try {
  const packed = JSON.parse(run(['pack', root, '--ignore-scripts', '--json', '--pack-destination', temp]));
  const tarball = path.join(temp, packed[0].filename);
  assert.ok(packed[0].files.some(file => file.path === 'bin/ndev-spec.js'));
  assert.ok(!packed[0].files.some(file => file.path.startsWith('specs/')));
  const help = run(['exec', '--yes', '--offline', '--package', tarball, '--', 'ndev-spec', '--help']);
  assert.match(help, /ndev-spec init/);

  // Ejercitar también el canal Git por commit, sin publicar el repositorio del usuario.
  const source = path.join(temp, 'git package with spaces');
  fs.mkdirSync(source);
  for (const name of ['bin', 'lib']) fs.cpSync(path.join(root, name), path.join(source, name), { recursive: true });
  for (const name of ['package.json', 'README.md']) fs.copyFileSync(path.join(root, name), path.join(source, name));
  for (const name of ['README.md', 'workflow.md', 'skills/constitution/SKILL.md']) {
    const file = path.join(source, '.ai', name);
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, '# Fixture\n');
  }
  const template = path.join(temp, 'template'); fs.mkdirSync(template);
  git(source, ['init', '--quiet', `--template=${template}`]);
  git(source, ['config', 'core.autocrlf', 'false']);
  git(source, ['add', '--all']);
  git(source, ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=', 'commit', '--quiet', '-m', 'packaged fixture']);
  const oid = git(source, ['rev-parse', 'HEAD']).toString().trim();
  const specifier = `git+${pathToFileURL(source).href}#${oid}`;
  const target = path.join(temp, 'consumer');
  const result = run(['exec', '--yes', '--package', specifier, '--', 'ndev-spec', 'init', target, '--source', source, '--ref', oid, '--yes']);
  assert.match(result, /Instalación verificada/);
  assert.match(fs.readFileSync(path.join(target, 'PROJECT.md'), 'utf8'), new RegExp(oid));
  assert.equal(git(target, ['ls-files']).length, 0);
  console.log('Paquete tarball + npx/npm exec desde Git por commit: OK. Sin publicación.');
} catch (error) {
  console.error(error.stderr?.toString() || error.stack);
  process.exitCode = 1;
} finally {
  // temp es exclusivamente el directorio creado arriba, fuera del consumidor real.
  fs.rmSync(temp, { recursive: true, force: true });
}
