# ✨ Telegram AI

[![JavaScript](https://img.shields.io/badge/language-JavaScript-brightgreen)](https://www.javascript.com/)
[![npm](https://img.shields.io/badge/package_manager-npm-blue)](https://www.npmjs.com/)


> Bot Telegram AI Gemini yang sederhana menggunakan Node.js.

## ✨ Fitur Utama

* **Integrasi Google Gemini AI:**  Menggunakan library `@google/genai` untuk mengakses dan memanfaatkan kemampuan AI Gemini.
* **Pengolahan Gambar dengan JIMP:**  Memanfaatkan library JIMP untuk manipulasi dan pengolahan gambar yang mungkin dibutuhkan oleh bot.
* **Antarmuka Telegram:**  Bot ini terhubung ke Telegram melalui `node-telegram-bot-api`, memungkinkan interaksi pengguna melalui platform Telegram.
* **Manajemen Pengguna:**  File `adminID.json` dan `premiumUsers.json` menunjukkan pengelolaan pengguna yang berbeda, mungkin untuk fitur admin atau pengguna premium.
* **Penggunaan File Lokal:**  Bot mengandalkan file JSON lokal (`gemini_db.json`, `adminID.json`, `premiumUsers.json`, `settings.js`) untuk menyimpan data dan pengaturan.  Ini mungkin menunjukkan basis data sederhana atau kurangnya integrasi database eksternal.
* **Pengunduhan File:** Folder `downloads` menunjukkan kemungkinan fungsionalitas pengunduhan file dari pengguna.
* **Penggunaan Axios:** Memanfaatkan library Axios untuk melakukan permintaan HTTP, kemungkinan untuk interaksi dengan layanan eksternal.

## 🛠️ Tumpukan Teknologi

| Kategori         | Teknologi             | Catatan                                      |
|-----------------|----------------------|----------------------------------------------|
| Bahasa Pemrograman | JavaScript           | Bahasa utama untuk pengembangan bot.         |
| Manajer Paket     | npm                   | Digunakan untuk manajemen dependensi.          |
| Library Telegram  | node-telegram-bot-api | Untuk interaksi dengan API Telegram.         |
| Library AI       | @google/genai        | Untuk integrasi dengan Google Gemini AI.       |
| Library Gambar    | JIMP                  | Untuk manipulasi gambar.                       |
| Library HTTP     | Axios                 | Untuk melakukan permintaan HTTP.               |


## 🏛️ Tinjauan Arsitektur

Arsitektur bot ini relatif sederhana, bergantung pada file konfigurasi dan database lokal.  Tidak terdapat bukti penggunaan basis data yang lebih kompleks atau arsitektur microservice.  Alur kerja utama melibatkan penerimaan input dari Telegram, pemrosesan (mungkin termasuk interaksi dengan Gemini AI), dan pengiriman respon kembali ke Telegram.

## 🚀 Memulai

1. Kloning repositori:
   ```bash
   git clone https://github.com/Fiisya/Telegram-AI.git
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd Telegram-AI
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan bot:
   ```bash
   npm start
   ```

## 📂 Struktur File

```
/
├── README.md
├── adminID.json          // Data ID admin
├── bot.js                // Bagian utama bot (mungkin)
├── downloads             // Direktori untuk file yang diunduh
│   └── alfixd            // File yang diunduh (contoh)
├── gemini_db.json        // Database utama bot
├── index.js              // File entry point utama
├── package.json          // File deklarasi dependensi
├── premiumUsers.json     // Data pengguna premium
└── settings.js           // File konfigurasi
```

* **/:** Direktori root proyek.
* **/downloads:** Direktori untuk menyimpan file yang diunduh oleh bot.
* **/adminID.json, premiumUsers.json, settings.js, gemini_db.json:** File konfigurasi dan penyimpanan data.


tqto: izz
