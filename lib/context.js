export const BEGIN = '<!-- ndev-spec:begin -->';
export const END = '<!-- ndev-spec:end -->';
export const ADAPTER = `${BEGIN}\n## ndev-spec\n\nAntes de trabajar, leer .ai/README.md, .ai/skills/README.md y PROJECT.md.\nAplicar el workflow y las reglas del canon local; leer solo la skill necesaria\ny los artefactos del cambio activo. Si PROJECT tiene pendientes, usar\n.ai/skills/constitution/SKILL.md antes del trabajo que dependa de ellos.\n${END}\n`;

export function textFile(data, name) {
  const value = data.toString('utf8');
  if (!Buffer.from(value).equals(data) || value.includes('\0')) throw new Error(`${name} debe ser texto UTF-8.`);
  return value;
}

export function provenance(value) {
  const headings = [...value.matchAll(/^## ndev-spec\r?$/gm)];
  if (headings.length > 1) throw new Error('Procedencia duplicada en PROJECT.md.');
  if (!headings.length) return null;
  const start = headings[0].index;
  const afterHeading = start + headings[0][0].length;
  const tail = value.slice(afterHeading);
  const next = /^#{1,2} /m.exec(tail);
  const end = next ? afterHeading + next.index : value.length;
  const section = value.slice(start, end);
  const origins = [...section.matchAll(/^- Origen: (.+)\r?$/gm)];
  const revisions = [...section.matchAll(/^- Revisión: ([a-f0-9]+)\r?$/gm)];
  if (origins.length !== 1 || revisions.length !== 1) throw new Error('Procedencia incompleta o ambigua en PROJECT.md.');
  // Mantener bytes posteriores, incluido el espacio que separa la siguiente sección.
  const lastLine = Math.max(origins[0].index + origins[0][0].length, revisions[0].index + revisions[0][0].length);
  if (section.slice(lastLine).trim()) throw new Error('Contenido desconocido en sección de procedencia.');
  const unknown = section.split(/\r?\n/).filter(l => l.trim() && l !== '## ndev-spec' &&
    !l.startsWith('- Origen: ') && !l.startsWith('- Revisión: '));
  if (unknown.length) throw new Error('Contenido desconocido en sección de procedencia.');
  const contentEnd = section[lastLine - 1] === '\r' ? lastLine - 1 : lastLine;
  return { source: origins[0][1].trim(), revision: revisions[0][1], start, end: start + contentEnd };
}

export function projectText(previous, source, revision) {
  const eol = previous?.includes('\r\n') ? '\r\n' : '\n';
  const section = `## ndev-spec${eol}${eol}- Origen: ${source}${eol}- Revisión: ${revision}`;
  if (previous === null) return `# Contexto del proyecto\n\n## Propósito y etapa\n\nPendiente de definir con constitution.\n\n## Contexto técnico y restricciones\n\nPendiente de relevar y acordar.\n\n## Comprobaciones\n\nPendientes de relevar; no se asumen comandos.\n\n## Entrega\n\nMecanismo y autorizaciones pendientes de definir.\n\n${section}\n`;
  const record = provenance(previous);
  if (!record) return previous + (previous.endsWith(eol + eol) ? '' : previous.endsWith(eol) ? eol : eol + eol) + section + eol;
  return previous.slice(0, record.start) + section + previous.slice(record.end);
}

export function agentText(previous, requireManaged = false) {
  if (previous === null) {
    if (requireManaged) throw new Error('Falta AGENTS.md gestionado; revisar antes de actualizar.');
    return ADAPTER;
  }
  const count = marker => previous.split(marker).length - 1;
  const external = previous.replace(/<!-- ndev-spec:begin -->[\s\S]*?<!-- ndev-spec:end -->/g, '');
  if (/(?:no (?:leer|usar|aplicar)|(?:do not|never) (?:read|use|apply))[^\n]*(?:\.ai|ndev-spec)/i.test(external)) {
    throw new Error('AGENTS.md prohíbe usar el canon; resolver el conflicto antes de instalar.');
  }
  if (count(BEGIN) || count(END)) {
    if (count(BEGIN) !== 1 || count(END) !== 1) throw new Error('Marcas ambiguas en AGENTS.md.');
    const start = previous.indexOf(BEGIN), end = previous.indexOf(END) + END.length;
    if (start >= end || previous.slice(start, end).replaceAll('\r\n', '\n') !== ADAPTER.trimEnd()) {
      throw new Error('El bloque gestionado de AGENTS.md fue modificado.');
    }
    return previous;
  }
  if (requireManaged) throw new Error('Falta el bloque gestionado de AGENTS.md.');
  const eol = previous.includes('\r\n') ? '\r\n' : '\n';
  return previous + (previous.endsWith(eol + eol) ? '' : previous.endsWith(eol) ? eol : eol + eol) + ADAPTER.replaceAll('\n', eol);
}
