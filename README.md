<img width="720" height="1600" alt="WhatsApp Image 2026-06-11 at 14 05 35" src="https://github.com/user-attachments/assets/5d068016-b985-4c4b-aa39-07b1c8179ef3" />
<img width="720" height="1600" alt="WhatsApp Image 2026-06-11 at 14 05 47" src="https://github.com/user-attachments/assets/4d332040-f6a9-494e-a475-26e40148639a" />
<img width="720" height="1600" alt="WhatsApp Image 2026-06-11 at 14 05 47 (1)" src="https://github.com/user-attachments/assets/619ab539-f7e3-4bef-b048-e4b30dcd948f" />
<img width="720" height="1600" alt="WhatsApp Image 2026-06-11 at 14 05 39" src="https://github.com/user-attachments/assets/2841e993-8d0f-4927-91b5-88b07171a0b7" />
# 📝 Notes+ — Reminders, Habits & Wellness Tracker

A personal reminders, habit & wellness tracking app — built as a **Progressive Web App** with pure HTML/CSS/JavaScript, then converted to a **native Android app** using **Capacitor + Node.js**. 💗

🔗 **Live web app:** https://rudrahihu.github.io/notes-plus/
📦 **Download APK:** see [Releases](../../releases)

## ✨ Features

- 📌 Personal notes & reminders
- 🔁 Habit tracking
- 🧘 Wellness tracker
- 🔔 Push notifications (Service Worker)
- 📴 **Works offline** — full offline caching
- 📲 Available as **installable PWA** *and* **native Android APK**

## 🛠️ Tech Stack

| Tech | Used for |
|------|----------|
| HTML / CSS / JavaScript | The entire app UI + logic (no frameworks) |
| Service Worker (`sw.js`) | Offline caching + push notifications |
| Web App Manifest | PWA installability, icons, theming |
| LocalStorage | On-device data persistence |
| **Node.js + Capacitor** | Wrapping the web app into a native Android app |
| Android Studio / Gradle | Building the APK |

## 📂 Project Structure

```
├── index.html         # the web app (UI + logic)
├── manifest.json      # PWA manifest
├── sw.js              # service worker
├── icon-*.png         # app icons (96 / 192 / 512)
├── package.json       # Node.js / Capacitor setup
├── capacitor.config.* # Capacitor configuration
└── android/           # native Android project (Capacitor)
```

## 🚀 Run it yourself

**As a website:** just open `index.html`, or visit the live link.

**Build the Android app:**
```bash
npm install
npx cap sync android
npx cap open android   # opens in Android Studio → Build APK
```

## 📲 Two ways to install on your phone

1. **PWA:** open the live link → Chrome → ⋮ → *Add to Home screen*
2. **APK:** download from [Releases](../../releases) → install

## 🖼️ Screenshots

<!-- Edit this file on GitHub and drag-drop your app screenshots here -->

---

Made with 💖 by [Rudrahihu](https://github.com/Rudrahihu)
