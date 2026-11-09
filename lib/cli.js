import { createInterface } from 'node:readline/promises';
import { stdin, stdout, stderr } from 'node:process';
import { prepare, apply, dispose } from './installer.js';
import { hash } from './files.js';

export const HELP = `ndev-spec — adquisición del canon (Node >=24 + Git)

  ndev-spec init [directorio] [--source <origen>] [--ref <referencia>]
  ndev-spec update [directorio] [--ref <referencia>]

  --dry-run   Mostrar propuesta sin escribir en el destino
  --diff      Mostrar archivos y contenido anterior/propuesto completo
  --yes       Aceptar una propuesta válida sin preguntar
  --help      Mostrar ayuda

Directorio por defecto: .; revisión por defecto: HEAD del origen.
No crea commits ni prepara el índice. Requiere acceso exclusivo al destino.
`;

export function parse(argv) {
  if (!argv.length || (argv.length === 1 && ['--help', '-h'].includes(argv[0]))) return { help: true };
  const [command, ...rest] = argv;
  if (!['init', 'update'].includes(command)) throw new Error(`Comando desconocido: ${command}`);
  const options = { command };
  const seen = new Set();
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (['--help', '-h'].includes(arg)) { options.help = true; continue; }
    if (arg.startsWith('-')) {
      if (!['--source', '--ref', '--dry-run', '--diff', '--yes'].includes(arg) || seen.has(arg)) throw new Error(`Opción inválida o duplicada: ${arg}`);
      seen.add(arg);
      const key = { '--source': 'source', '--ref': 'ref', '--dry-run': 'dryRun', '--diff': 'diff', '--yes': 'yes' }[arg];
      if (['--source', '--ref'].includes(arg)) {
        const value = rest[++i];
        if (!value || value.startsWith('-')) throw new Error(`Falta valor para ${arg}`);
        options[key] = value;
      } else options[key] = true;
    } else {
      if (options.directory !== undefined) throw new Error('Solo se admite un directorio.');
      options.directory = arg;
    }
  }
  if (command === 'update' && options.source) throw new Error('--source solo se admite en init.');
  return options;
}

// Mantener el texto legible sin permitir controles ANSI provenientes de archivos.
function readable(value) {
  return value.replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
}

function localChanges(op) {
  const before = op.before.data.toString('utf8').replaceAll('\r\n', '\n').split('\n');
  const after = op.after.data.toString('utf8').replaceAll('\r\n', '\n').split('\n');
  let start = 0, oldEnd = before.length, newEnd = after.length;
  while (start < oldEnd && start < newEnd && before[start] === after[start]) start++;
  while (oldEnd > start && newEnd > start && before[oldEnd - 1] === after[newEnd - 1]) { oldEnd--; newEnd--; }
  const lines = [...before.slice(start, oldEnd).map(line => `  - ${readable(line)}`),
    ...after.slice(start, newEnd).map(line => `  + ${readable(line)}`)];
  if (!lines.length) return '  Cambian los finales de línea o permisos; consultar --diff.\n';
  return lines.slice(0, 20).join('\n') + '\n' +
    (lines.length > 20 ? `  … ${lines.length - 20} líneas adicionales; consultar --diff.\n` : '');
}

export function describe(plan, { diff = false } = {}) {
  let output = `ndev-spec — ${plan.command === 'update' ? 'Actualización' : 'Instalación'}\n\nDestino: ${readable(plan.root)}\nOrigen: ${readable(plan.source)}\nRevisión: ${plan.revision}\n`;
  if (!plan.operations.length) return output + 'Sin cambios. La herramienta no crea commits; revisar pendientes con git status.\n';
  output += '\nCambios propuestos:\n';
  if (!plan.isRepo) output += '  Git: inicializar repositorio.\n';
  const canon = plan.operations.filter(op => op.name.startsWith('.ai/'));
  if (canon.length) {
    const counts = [
      [canon.filter(op => !op.before).length, 'nuevo'],
      [canon.filter(op => op.before && op.after).length, 'modificado'],
      [canon.filter(op => !op.after).length, 'eliminado'],
    ].filter(([count]) => count).map(([count, label]) => `${count} ${label}${count === 1 ? '' : 's'}`).join(', ');
    output += `  .ai/: ${canon.length} archivo${canon.length === 1 ? '' : 's'} (${counts}); workflow, reglas y skills.\n`;
  }
  for (const op of plan.operations.filter(op => !op.name.startsWith('.ai/'))) {
    const purpose = op.name === 'PROJECT.md' ? 'contexto pendiente y registro de origen/revisión' : 'entrada al canon para el agente';
    output += `  ${op.name}: ${!op.before ? `crear ${purpose}` : !op.after ? 'eliminar' : 'actualizar'}.\n`;
    if (op.before && op.after) output += localChanges(op);
  }
  output += '\nRevisá que tus instrucciones locales sean compatibles con el canon.\n';
  output += 'El commit queda a tu cargo.\n';
  if (!diff) return output + 'Para ver cada archivo y su contenido completo, agregá --diff (podés combinarlo con --dry-run).\n';
  output += '\nDetalle completo (anterior/propuesto):\n';
  for (const op of plan.operations) {
    output += `\n${!op.before ? 'A' : !op.after ? 'D' : 'M'} ${op.name}\n`;
    for (const [label, entry] of [['anterior', op.before], ['propuesto', op.after]]) {
      if (!entry) continue;
      const value = entry.data.toString('utf8');
      output += `${label}: modo ${entry.mode.toString(8)}; ${entry.data.length} bytes\n`;
      if (entry.data.includes(0) || !Buffer.from(value).equals(entry.data)) output += `binario SHA-256 ${hash(entry.data)}\n`;
      else output += value.split('\n').map(line => `${label === 'anterior' ? '-' : '+'}${readable(line)}`).join('\n') + '\n';
    }
  }
  return output;
}

export async function main(argv = process.argv.slice(2), io = { stdin, stdout, stderr }) {
  let plan;
  try {
    const options = parse(argv);
    if (options.help) { io.stdout.write(HELP); return; }
    plan = prepare(options);
    io.stdout.write(describe(plan, options));
    if (options.dryRun) { io.stdout.write('\nSimulación: no se aplicaron cambios.\n'); return; }
    if (!plan.operations.length) return;
    if (!options.yes) {
      if (!io.stdin.isTTY || !io.stdout.isTTY) throw new Error('Sin terminal interactiva: revisar con --dry-run y usar --yes explícitamente.');
      const reader = createInterface({ input: io.stdin, output: io.stdout });
      let answer;
      try { answer = await reader.question('\n¿Aplicar esta propuesta? [s/N] '); }
      finally { reader.close(); }
      if (!['s', 'si', 'sí', 'y', 'yes'].includes(answer.trim().toLowerCase())) { io.stdout.write('Cancelado; destino sin cambios.\n'); return; }
    }
    apply(plan);
    io.stdout.write(`\n${plan.command === 'update' ? 'Actualización' : 'Instalación'} verificada.\nCommit pendiente: revisá los cambios y confirmalos en Git.\n`);
    io.stdout.write('Siguiente paso: pedile al agente que lea AGENTS.md y aplique .ai/skills/constitution/SKILL.md para completar PROJECT.md.\n');
  } catch (error) {
    io.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  } finally { dispose(plan); }
}
