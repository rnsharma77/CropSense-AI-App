const fs = require('fs');
const path = require('path');

// Simple i18n extractor + applier
// Usage: node scripts/i18n-extract.js [--apply] [--src=src]

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const SRC = (argv.find(a => a.startsWith('--src=')) || '--src=src').split('=')[1];

function walk(dir, files=[]) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) walk(p, files);
    else if (/\.jsx?$/.test(it.name)) files.push(p);
  }
  return files;
}

function slug(s){
  return s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,60);
}

function findStrings(code) {
  const found = new Set();
  // JSX text nodes between >text<
  const reText = />\s*([^<>\n{}][^<>]*?)\s*</g;
  let m;
  while ((m = reText.exec(code))) {
    const txt = m[1].trim();
    if (txt && txt.length>2 && /[a-zA-Z0-9]/.test(txt)) found.add(txt);
  }
  // Attribute-like values: placeholder/title/alt/aria-label
  const reAttr = /(placeholder|title|alt|aria-label)=['\"]([^'\"]{3,}?)['\"]/g;
  while ((m = reAttr.exec(code))) {
    const txt = m[2].trim();
    if (txt && /[a-zA-Z0-9]/.test(txt)) found.add(txt);
  }
  return Array.from(found);
}

function applyReplacements(filePath, replacements) {
  let code = fs.readFileSync(filePath,'utf8');
  for (const {orig, key, type} of replacements) {
    if (type === 'text') {
      // replace >orig< with >{t('key')}< (escape for regex)
      const esc = orig.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&');
      const re = new RegExp('>\\s*'+esc+'\\s*<','g');
      code = code.replace(re, `>{t('${key}')}<`);
    } else if (type === 'attr') {
      const esc = orig.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&');
      const re = new RegExp(`(placeholder|title|alt|aria-label)=['\"]${esc}['\"]`,'g');
      code = code.replace(re, (m, p1) => `${p1}={t('${key}')}`);
    }
  }
  fs.writeFileSync(filePath, code, 'utf8');
}

function mergeIntoLangContext(entries) {
  const ctxPath = path.join(process.cwd(),'src','context','LangContext.js');
  let code = fs.readFileSync(ctxPath,'utf8');
  const insertAfter = '  // ── Chat Page ────────────────────────────────────────────';
  const pos = code.indexOf(insertAfter);
  let insertPos = -1;
  if (pos !== -1) {
    insertPos = code.indexOf('\n', pos) + 1;
  } else {
    // fallback: before the closing brace of T
    insertPos = code.lastIndexOf('\n};');
  }
  let block = '\n';
  for (const [key, val] of Object.entries(entries)) {
    block += `  ${key}: { en: ${JSON.stringify(val)} },\n`;
  }
  // naive insert before the closing '};' of T
  const closing = code.lastIndexOf('\n};');
  if (closing !== -1) {
    code = code.slice(0, closing) + block + code.slice(closing);
    fs.writeFileSync(ctxPath, code, 'utf8');
    console.log('LangContext.js updated with', Object.keys(entries).length, 'keys');
  } else {
    console.warn('Could not find insertion point for LangContext.js; please add keys manually.');
  }
}

function main() {
  const base = path.join(process.cwd(), SRC);
  const files = walk(base, []);
  const globalMap = {};
  const occurrences = {};
  for (const f of files) {
    const code = fs.readFileSync(f,'utf8');
    const strs = findStrings(code);
    if (strs.length) {
      occurrences[f] = strs;
      for (const s of strs) {
        if (!globalMap[s]) {
          let k = slug(s) || 'str';
          k = `auto_${k}`;
          let idx = 1;
          let uniq = k;
          while (Object.values(globalMap).includes(uniq)) { uniq = `${k}_${idx++}`; }
          globalMap[s] = uniq;
        }
      }
    }
  }

  if (!Object.keys(globalMap).length) {
    console.log('No candidate strings found.');
    return;
  }

  // Prepare replacements list per file
  const fileRepls = {};
  for (const [f, arr] of Object.entries(occurrences)) {
    fileRepls[f] = arr.map(s => {
      // decide whether attr or text by searching in file
      const code = fs.readFileSync(f,'utf8');
      const attrRe = new RegExp(`(placeholder|title|alt|aria-label)=['\"]${s.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')}['\"]`);
      return { orig: s, key: globalMap[s], type: attrRe.test(code)?'attr':'text' };
    });
  }

  console.log('Found', Object.keys(globalMap).length, 'unique strings across', Object.keys(occurrences).length, 'files.');
  if (!APPLY) {
    console.log('Dry-run mode. To apply changes, re-run with --apply');
    console.log('\nMapping preview:\n', JSON.stringify(globalMap, null, 2));
    console.log('\nPer-file replacements preview:');
    for (const [f, reps] of Object.entries(fileRepls)) {
      console.log(' -', path.relative(process.cwd(), f));
      for (const r of reps) console.log('    ', r.type, r.orig, '=>', r.key);
    }
    return;
  }

  // Apply replacements
  for (const [f, reps] of Object.entries(fileRepls)) {
    applyReplacements(f, reps);
    console.log('Patched', path.relative(process.cwd(), f));
  }

  // Merge into LangContext
  const entries = {};
  for (const [s,k] of Object.entries(globalMap)) entries[k] = s;
  mergeIntoLangContext(entries);
}

main();
