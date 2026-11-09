import { createInterface } from 'node:readline/promises';
import { stdin, stdout, stderr } from 'node:process';
import { prepare, apply, dispose } from './installer.js';
import { hash } from './files.js';

export const HELP = `ndev-spec — adquisición del canon (Node >=24 + Git)

  ndev-spec init [directorio] [--source <origen>] [--ref <referencia>]
  ndev-spec update [directorio] [--ref <referencia>]

  --dry-run   Mostrar propuesta sin escribir en el destino
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
      if (!['--source', '--ref', '--dry-run', '--yes'].includes(arg) || seen.has(arg)) throw new Error(`Opción inválida o duplicada: ${arg}`);
      seen.add(arg);
      const key = { '--source': 'source', '--ref': 'ref', '--dry-run': 'dryRun', '--yes': 'yes' }[arg];
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

export function describe(plan) {
  let output = `Destino: ${plan.root}\nOrigen: ${plan.source}\nRevisión: ${plan.revision}\n`;
  if (!plan.isRepo) output += 'Se inicializará Git sin crear commits.\n';
  output += 'Revisar compatibilidad de las instrucciones locales con el canon.\n';
  if (!plan.operations.length) return output + 'Sin cambios. La herramienta no crea commits; revisar pendientes con git status.\n';
  for (const op of plan.operations) {
    output += `\n${!op.before ? 'A' : !op.after ? 'D' : 'M'} ${op.name}\n`;
    for (const [label, entry] of [['anterior', op.before], ['propuesto', op.after]]) {
      if (!entry) continue;
      const value = entry.data.toString('utf8');
      output += `${label}: modo ${entry.mode.toString(8)}; ${entry.data.length} bytes\n`;
      if (entry.data.includes(0) || !Buffer.from(value).equals(entry.data)) output += `binario SHA-256 ${hash(entry.data)}\n`;
      else output += value.split('\n').map(line => `${label === 'anterior' ? '-' : '+'}${JSON.stringify(line)}`).join('\n') + '\n';
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
    io.stdout.write(describe(plan));
    if (options.dryRun || !plan.operations.length) return;
    if (!options.yes) {
      if (!io.stdin.isTTY || !io.stdout.isTTY) throw new Error('Sin terminal interactiva: revisar con --dry-run y usar --yes explícitamente.');
      const reader = createInterface({ input: io.stdin, output: io.stdout });
      let answer;
      try { answer = await reader.question('\n¿Aplicar esta propuesta? [s/N] '); }
      finally { reader.close(); }
      if (!['s', 'si', 'sí', 'y', 'yes'].includes(answer.trim().toLowerCase())) { io.stdout.write('Cancelado; destino sin cambios.\n'); return; }
    }
    apply(plan);
    io.stdout.write(`\n${plan.command === 'update' ? 'Actualización' : 'Instalación'} verificada. Commit pendiente: revisar y confirmar las rutas mostradas.\n`);
    io.stdout.write('Siguiente paso con el agente: «Leé .ai/README.md, .ai/skills/README.md, AGENTS.md y PROJECT.md. Aplicá .ai/skills/constitution/SKILL.md para completar el contexto y resolver los pendientes antes del trabajo afectado».\n');
  } catch (error) {
    io.stderr.write(`Error: ${error.message}\n`);
    process.exitCode = 1;
  } finally { dispose(plan); }
}
