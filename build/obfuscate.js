#!/usr/bin/env node
/* يبني index.html (المنشور) من src/index.src.html عبر تشويش الـ JS الرئيسي بين علامتي APP_JS_START و APP_JS_END. */
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'index.src.html');
const OUT = path.join(ROOT, 'index.html');
const START = '/*APP_JS_START*/', END = '/*APP_JS_END*/';

const src = fs.readFileSync(SRC, 'utf8');
const i = src.indexOf(START), j = src.indexOf(END);
if (i < 0 || j < 0 || j < i) { console.error('markers not found'); process.exit(1); }
const before = src.slice(0, i);
const code = src.slice(i + START.length, j);
const after = src.slice(j + END.length);

// نغلّف الكود في دالة فورية حتى تُشوَّش كل الأسماء (لا يعتمد HTML على أي دالة عامة)
const wrapped = '(function(){' + code + '\n})();';
const result = JavaScriptObfuscator.obfuscate(wrapped, {
  compact: true,
  seed: 20260930,              // بذرة ثابتة: نفس المصدر ينتج نفس الملف دائماً
  target: 'browser',
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  reservedStrings: ['^pbkdf2\\$'],   // نُبقي ADMIN_HASH كما هو حرفياً (بصمة عامة، ليست سراً)
  splitStrings: true,
  splitStringsChunkLength: 12,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: false,
  numbersToExpressions: true,
  simplify: true,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  identifierNamesGenerator: 'mangled',
  renameGlobals: false,        // نُبقي أسماء الدوال العامة سليمة (تُستدعى من DOM/سكربتات أخرى)
  selfDefending: false,
  debugProtection: false,
  disableConsoleOutput: false
});

const obf = result.getObfuscatedCode();
const hashLine = (code.match(/const ADMIN_HASH = '([^']+)';/) || [])[1];
if (!hashLine || !obf.includes("'" + hashLine + "'")) { console.error('SAFETY: ADMIN_HASH not preserved verbatim'); process.exit(1); }
if (code.includes('admin123') || obf.includes('admin123')) { console.error('SAFETY: admin123 present in output'); process.exit(1); }

fs.writeFileSync(OUT, before + obf + after);
console.error('built index.html — obf JS bytes: ' + Buffer.byteLength(obf, 'utf8'));
