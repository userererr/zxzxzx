# zxzxzx
## 🛠️ تعديل الموقع وإعادة البناء

ملف `index.html` في جذر المستودع **مُولَّد تلقائياً**: كود الـ JavaScript فيه مُشوَّش (obfuscated). لا تعدّله يدوياً.

- **المصدر المقروء:** `src/index.src.html`. عدّل هنا فقط (HTML/CSS/JS).
- **أداة البناء:** `build/obfuscate.js` (تستخدم `javascript-obfuscator`)، وتشغّلها `build.sh`.
- صفحة `hash.html` مستقلة ولا تمر بعملية البناء.

### الخطوات
المتطلبات: Node.js 18 أو أحدث.

```bash
# 1) عدّل الملف المصدر
nano src/index.src.html

# 2) أعد توليد index.html المُشوَّش
./build.sh            # أول مرة يثبّت الأداة داخل build/ تلقائياً
# أو: cd build && npm install && npm run build

# 3) انشر
git add src/index.src.html index.html
git commit -m "تحديث الموقع"
git push
```

### تغيير كلمة مرور لوحة التحكم
1. افتح `hash.html` وولّد سطر البصمة.
2. ضعه مكان قيمة `ADMIN_HASH` في `src/index.src.html`.
3. شغّل `./build.sh` ثم انشر.

> ⚠️ ملاحظة: الملف المصدر `src/index.src.html` **عام** في المستودع، فأي شخص يقدر يقرأ الكود الأصلي. التشويش يصعّب قراءة الملف المنشور فقط وليس حماية أمنية. أمان لوحة التحكم يعتمد على بصمة كلمة المرور (PBKDF2)، وليس على إخفاء الكود.
