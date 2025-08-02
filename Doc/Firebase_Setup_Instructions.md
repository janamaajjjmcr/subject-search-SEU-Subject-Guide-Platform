# كيفية إصلاح Firebase - دليل خطوة بخطوة

## المشكلة الحالية:
Firebase لا يعمل بسبب قواعد الأمان (Security Rules) غير المضبوطة

## الحل: (خطوات بسيطة)

### الخطوة 1: اذهب إلى Firebase Console
1. افتح المتصفح واذهب إلى: https://console.firebase.google.com
2. اختر مشروع "seu-subjects"

### الخطوة 2: ضبط قواعد Firestore
1. من القائمة الجانبية، اختر **"Firestore Database"**
2. اختر تبويب **"Rules"** من الأعلى
3. استبدل القواعد الموجودة بهذا النص:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. اضغط **"Publish"** لحفظ القواعد

### الخطوة 3: اختبار الموقع
1. افتح موقعك (index.html)
2. افتح Developer Console (اضغط F12)
3. اكتب هذا الأمر: `testFirebaseConnection()`
4. يجب أن ترى: "✅ اتصال Firebase يعمل بنجاح!"

### الخطوة 4: اختبار إضافة مادة
1. في Console، اكتب: `addTestCourse()`
2. يجب أن ترى: "✅ تم إضافة المادة التجريبية بنجاح!"

### الخطوة 5: التحقق من البيانات
1. في Console، اكتب: `checkFirebaseData()`
2. يجب أن ترى قائمة بالمواد المحفوظة

## ملاحظات مهمة:
- هذه القواعد تسمح للجميع بالقراءة والكتابة (مناسبة للتجريب)
- في المستقبل، يمكن تحسين الأمان
- إذا لم تعمل، تأكد من أن اسم المشروع صحيح: "seu-subjects"

## إذا واجهت مشاكل:
1. تأكد من الاتصال بالإنترنت
2. تأكد من أن Firebase Console مفتوح على المشروع الصحيح
3. جرب إعادة تحميل الصفحة بعد ضبط القواعد

## أوامر مفيدة في Console:
- `testFirebaseConnection()` - اختبار الاتصال
- `addTestCourse()` - إضافة مادة تجريبية
- `checkFirebaseData()` - عرض البيانات المحفوظة
