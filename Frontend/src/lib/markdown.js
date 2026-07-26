/**
 * Minimal, safe markdown-ish renderer tailored to chat messages.
 * Supports: headings, bold, inline code, code blocks, tables,
 * blockquotes, ordered/unordered lists, links, and citation pills.
 * Returns React nodes — no dangerouslySetInnerHTML.
 */

const CITE_RE = /\[(PDF p\.\d+|Video [\d:]+|Docs|Transcript|Source \d+)\]/g;
function parseCitations(text, citations) {
  const parts = [];
  let last = 0;
  let m;
  CITE_RE.lastIndex = 0;
  while ((m = CITE_RE.exec(text)) !== null) {
    if (m.index > last)
      parts.push({
        text: text.slice(last, m.index),
      });
    const matched = m[1];
    const cite = citations?.find((c) => c.label === matched);
    parts.push({
      text: matched,
      cite,
    });
    last = m.index + m[0].length;
  }
  if (last < text.length)
    parts.push({
      text: text.slice(last),
    });
  return parts;
}
function tokenize(md="") {
  if (typeof md !== "string") {
    md = String(md ?? "");
  }
  const lines = md.split('\n');
  const tokens = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // blank
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // code block
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, '').trim();
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      tokens.push({
        type: 'code',
        text: code.join('\n'),
        lang,
      });
      continue;
    }

    // table (header | separator | rows)
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:-]+\|[\s:|-]+$/.test(lines[i + 1])
    ) {
      const header = splitRow(line);
      i += 2; // header + separator
      const rows = [header];
      while (i < lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      tokens.push({
        type: 'table',
        rows,
      });
      continue;
    }

    // headings
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      tokens.push({
        type: `h${h[1].length}`,
        text: h[2],
      });
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      tokens.push({
        type: 'blockquote',
        text: quote.join(' '),
      });
      continue;
    }

    // list
    if (/^(\s*)[-*]\s+/.test(line) || /^(\s*)\d+\.\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      while (
        i < lines.length &&
        (/^(\s*)[-*]\s+/.test(lines[i]) || /^(\s*)\d+\.\s+/.test(lines[i]))
      ) {
        items.push(lines[i].replace(/^(\s*)([-*]|\d+\.)\s+/, ''));
        i++;
      }
      tokens.push({
        type: 'list',
        items,
        ordered,
      });
      continue;
    }

    // paragraph (accumulate until blank or special)
    const para = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^#{1,3}\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^(\s*)[-*]\s+/.test(lines[i]) &&
      !/^(\s*)\d+\.\s+/.test(lines[i]) &&
      !(
        lines[i].includes('|') &&
        i + 1 < lines.length &&
        /^\s*\|?[\s:-]+\|[\s:|-]+$/.test(lines[i + 1])
      )
    ) {
      para.push(lines[i]);
      i++;
    }
    if (para.length)
      tokens.push({
        type: 'p',
        text: para.join(' '),
      });
  }
  return tokens;
}
function splitRow(line) {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}
export { parseCitations, tokenize };
