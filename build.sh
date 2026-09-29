#!/usr/bin/env bash
# يعيد بناء index.html المنشور من src/index.src.html بعد تشويش الـ JS الرئيسي.
# المتطلبات: Node.js (وnpm). أول مرة سيُثبّت أداة التشويش داخل build/.
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -d build/node_modules/javascript-obfuscator ]; then
  echo "تثبيت أداة التشويش..."
  (cd build && npm install)
fi
node build/obfuscate.js
echo "✅ تم بناء index.html"
