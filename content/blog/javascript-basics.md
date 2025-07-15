---
title: "آموزش مقدماتی جاوااسکریپت: مفاهیم پایه"
description: "در این مقاله با مفاهیم اولیه و پایه‌ای زبان برنامه‌نویسی جاوااسکریپت آشنا خواهید شد."
date: "2024-03-15"
tags: ["javascript", "frontend"]
category: "توسعه وب"
subcategory: "جاوااسکریپت"
image: https://images.unsplash.com/photo-1623479322729-28b25c16b011?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
readingTime: 8
author: "محمد امیر برخورداری"
---

# آموزش مقدماتی جاوااسکریپت

جاوااسکریپت یکی از محبوب‌ترین زبان‌های برنامه‌نویسی دنیاست که برای ساخت وب‌سایت‌های پویا و تعاملی استفاده می‌شود.

## متغیرها در جاوااسکریپت

در جاوااسکریپت، می‌توانید با استفاده از کلمات کلیدی `var`، `let` و `const` متغیر تعریف کنید:

```javascript
// تعریف متغیر با let
let name = "علی";
let age = 25;

// تعریف متغیر با const
const PI = 3.14;
```

## انواع داده در جاوااسکریپت

جاوااسکریپت دارای انواع داده مختلفی است:

- **String**: برای نگهداری متن
- **Number**: برای اعداد صحیح و اعشاری
- **Boolean**: برای مقادیر منطقی (true/false)
- **Array**: برای نگهداری لیستی از مقادیر
- **Object**: برای نگهداری مجموعه‌ای از داده‌ها

مثال:

```javascript
let text = "سلام دنیا";  // String
let number = 42;          // Number
let isActive = true;      // Boolean
let colors = ["قرمز", "آبی", "سبز"];  // Array
let person = {            // Object
  name: "علی",
  age: 25
};
```

## توابع در جاوااسکریپت

توابع بلوک‌های کد قابل استفاده مجدد هستند:

```javascript
// تعریف تابع
function sayHello(name) {
  return `سلام ${name}!`;
}

// استفاده از تابع
console.log(sayHello("علی")); // خروجی: سلام علی!

// Arrow Function
const add = (a, b) => a + b;
console.log(add(2, 3)); // خروجی: 5
```

## شرط‌ها و حلقه‌ها

### دستور if

```javascript
let age = 18;

if (age >= 18) {
  console.log("شما به سن قانونی رسیده‌اید");
} else {
  console.log("شما به سن قانونی نرسیده‌اید");
}
```

### حلقه for

```javascript
for (let i = 0; i < 5; i++) {
  console.log(`شماره ${i}`);
}
```

## رویدادها در جاوااسکریپت

می‌توانید به المان‌های HTML رویداد اضافه کنید:

```javascript
const button = document.querySelector('button');

button.addEventListener('click', () => {
  alert('دکمه کلیک شد!');
});
```

## نتیجه‌گیری

در این مقاله با مفاهیم پایه‌ای جاوااسکریپت آشنا شدیم. این مفاهیم پایه و اساس یادگیری جاوااسکریپت هستند و برای شروع برنامه‌نویسی وب ضروری می‌باشند. 