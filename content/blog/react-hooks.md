---
title: "آموزش React Hooks: مدیریت حالت در ری‌اکت"
description: "در این مقاله با هوک‌های اصلی ری‌اکت و نحوه استفاده از آن‌ها برای مدیریت حالت کامپوننت‌ها آشنا خواهید شد."
date: "2024-03-16"
tags: ["react", "javascript", "frontend",]
category: "توسعه وب"
image: https://images.unsplash.com/photo-1615321771528-1426355a8927?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
readingTime: 10
author: "علی"
---

# آموزش React Hooks

هوک‌ها در ری‌اکت امکان استفاده از state و سایر ویژگی‌های ری‌اکت را در کامپوننت‌های تابعی فراهم می‌کنند. در این مقاله با هوک‌های اصلی و پرکاربرد ری‌اکت آشنا خواهیم شد.

## useState: مدیریت حالت

هوک `useState` برای مدیریت حالت در کامپوننت‌های تابعی استفاده می‌شود:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>تعداد کلیک: {count}</p>
      <button onClick={() => setCount(count + 1)}>افزایش</button>
    </div>
  );
}
```

## useEffect: مدیریت اثرات جانبی

هوک `useEffect` برای اجرای کدهایی که اثرات جانبی دارند (مانند درخواست‌های API) استفاده می‌شود:

```jsx
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (!user) return <div>کاربر یافت نشد</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## useContext: مدیریت وضعیت سراسری

هوک `useContext` برای دسترسی به داده‌های context در کامپوننت‌های تابعی استفاده می‌شود:

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { isDark, setIsDark } = useContext(ThemeContext);

  return (
    <button onClick={() => setIsDark(!isDark)}>
      تغییر تم به {isDark ? "روشن" : "تیره"}
    </button>
  );
}
```

## useRef: دسترسی به DOM

هوک `useRef` برای نگهداری مقادیر متغیر و دسترسی مستقیم به المان‌های DOM استفاده می‌شود:

```jsx
import { useRef, useEffect } from "react";

function AutoFocusInput() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="این input به صورت خودکار فوکوس می‌شود"
    />
  );
}
```

## useMemo و useCallback: بهینه‌سازی عملکرد

این هوک‌ها برای بهینه‌سازی عملکرد برنامه با جلوگیری از محاسبات غیرضروری استفاده می‌شوند:

```jsx
import { useMemo, useCallback } from "react";

function ExpensiveComponent({ data, onItemSelect }) {
  // محاسبات پیچیده روی داده‌ها
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      processed: expensiveOperation(item),
    }));
  }, [data]);

  // ایجاد تابع callback
  const handleSelect = useCallback(
    (item) => {
      console.log("آیتم انتخاب شد:", item);
      onItemSelect(item);
    },
    [onItemSelect]
  );

  return (
    <ul>
      {processedData.map((item) => (
        <li key={item.id} onClick={() => handleSelect(item)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

## نکات مهم در استفاده از هوک‌ها

1. هوک‌ها فقط در سطح بالای کامپوننت‌های تابعی قابل استفاده هستند
2. هوک‌ها نباید درون شرط‌ها یا حلقه‌ها استفاده شوند
3. همیشه از قوانین هوک‌ها (Rules of Hooks) پیروی کنید
4. برای اثرات جانبی پیچیده، می‌توانید از هوک‌های سفارشی استفاده کنید

## نتیجه‌گیری

هوک‌ها یکی از قدرتمندترین ویژگی‌های ری‌اکت هستند که به ما امکان می‌دهند کد تمیزتر و قابل نگهداری‌تری بنویسیم. با درک درست از نحوه کارکرد هوک‌ها و موارد استفاده آن‌ها، می‌توانید کامپوننت‌های بهتر و کارآمدتری ایجاد کنید.
