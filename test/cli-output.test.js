import test from 'node:test';
import assert from 'node:assert/strict';
import { describe, parse, HELP } from '../lib/cli.js';

const file = text => ({ data: Buffer.from(text), mode: 0o644 });
const plan = operations => ({ command: 'init', root: '/proyectos/app', source: '/origen/ndev-spec',
  revision: 'a'.repeat(40), isRepo: false, operations });

test('instalación grande presenta un resumen breve sin volcar el canon', () => {
  const operations = Array.from({ length: 21 }, (_, i) => ({ name: `.ai/file-${i}.md`,
    before: null, after: file('CONTENIDO DEL CANON\n'.repeat(3000)) }));
  operations.push({ name: 'PROJECT.md', before: null, after: file('# Contexto\n') },
    { name: 'AGENTS.md', before: null, after: file('# Agente\n') });
  const output = describe(plan(operations));
  assert.match(output, /21 archivos \(21 nuevos\)/);
  assert.match(output, /PROJECT.md: crear contexto pendiente/);
  assert.match(output, /AGENTS.md: crear entrada al canon/);
  assert.match(output, /--diff/);
  assert.doesNotMatch(output, /CONTENIDO DEL CANON|propuesto: modo/);
  assert.ok(output.split('\n').length <= 20);
});

test('actualización informa bajas y cambios locales sin repetir el contexto ajeno', () => {
  const outside = 'CONTEXTO AJENO\n'.repeat(2000);
  const output = describe({ ...plan([
    { name: '.ai/old.md', before: file('old'), after: null },
    { name: '.ai/rule.md', before: file('a'), after: file('b') },
    { name: 'PROJECT.md', before: file(outside + '- Revisión: anterior\n' + outside),
      after: file(outside + '- Revisión: nueva\n' + outside) },
  ]), command: 'update', isRepo: true });
  assert.match(output, /Actualización/);
  assert.match(output, /1 modificado, 1 eliminado/);
  assert.match(output, /- - Revisión: anterior/);
  assert.match(output, /\+ - Revisión: nueva/);
  assert.doesNotMatch(output, /CONTEXTO AJENO|Git: inicializar/);
});

test('detalle optativo muestra texto legible, binarios y modos sin controles ANSI', () => {
  const output = describe(plan([
    { name: '.ai/rule.md', before: file('Antes\n'), after: file('Después\n\x1b[31m\x9b31m') },
    { name: '.ai/image.bin', before: null, after: { data: Buffer.from([0, 255]), mode: 0o644 } },
  ]), { diff: true });
  assert.match(output, /M .ai\/rule.md/);
  assert.match(output, /-Antes\n/);
  assert.match(output, /\+Después\n/);
  assert.match(output, /propuesto: modo 644/);
  assert.match(output, /binario SHA-256/);
  assert.doesNotMatch(output, /\x1b|\x9b|\+"Después"/);
});

test('cambios locales extensos se acotan con indicación explícita del detalle', () => {
  const output = describe(plan([{ name: 'AGENTS.md', before: file('antes\n'), after: file('instrucción\n'.repeat(100)) }]));
  assert.match(output, /líneas adicionales; consultar --diff/);
  assert.ok(output.split('\n').length < 40);
  assert.doesNotMatch(describe(plan([])), /Cambios propuestos|--diff/);
});

test('parser y ayuda admiten --diff combinado con dry-run y rechazan duplicados', () => {
  assert.deepEqual(parse(['update', '.', '--diff', '--dry-run']), { command: 'update', directory: '.', diff: true, dryRun: true });
  assert.throws(() => parse(['init', '--diff', '--diff']));
  assert.match(HELP, /--diff/);
});
