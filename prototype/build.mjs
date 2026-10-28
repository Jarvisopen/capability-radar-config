import { readFile, writeFile } from 'node:fs/promises';

// Rebuild only the new prototype iframe; the original root index.html is untouched.
const base = new URL('./', import.meta.url);
const [css, js, wrapper] = await Promise.all([
  readFile(new URL('app.css', base), 'utf8'),
  readFile(new URL('app.js', base), 'utf8'),
  readFile(new URL('index.html', base), 'utf8'),
]);
const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
const inner = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; base-uri 'none'; form-action 'none'"><style>${css}</style></head><body><div id="cap-radar-config"></div><script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script><script>${js}</script></body></html>`;
if (!/srcdoc="[^"]*"/.test(wrapper)) throw new Error('Prototype iframe not found');
await writeFile(new URL('index.html', base), wrapper.replace(/srcdoc="[^"]*"/, () => `srcdoc="${escapeAttribute(inner)}"`));
console.log('Updated prototype/index.html');
