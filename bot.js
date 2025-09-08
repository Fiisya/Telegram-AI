require('./settings') 

const TelegramBot = require('node-telegram-bot-api');
const { exec } = require("child_process");
const path = require("path");
const fs = require('fs');
const FormData = require('form-data');
const { URLSearchParams } = require("url");
const botToken = global.token
const owner = global.adminId
const adminfile = 'adminID.json';
const premiumUsersFile = 'premiumUsers.json';
const { GoogleGenAI, createUserContent, createPartFromUri, Modality } = require("@google/genai");
const aiGemini = new GoogleGenAI({ apiKey: `${global.apigemini}` });

const prefix = '[\\/\\.\\~\\$\\>]';

const geminiDbFile = "./gemini_db.json";
if (!fs.existsSync(geminiDbFile)) {
  fs.writeFileSync(geminiDbFile, JSON.stringify({ status: true, sessions: {} }, null, 2), "utf-8");
}
const autoGeminiDB = JSON.parse(fs.readFileSync(geminiDbFile, "utf-8"));

try {
    premiumUsers = JSON.parse(fs.readFileSync(premiumUsersFile));
} catch (error) {
    console.error('Error reading premiumUsers file:', error);
}
try {
    adminUsers = JSON.parse(fs.readFileSync(adminfile));
} catch (error) {
    console.error('Error reading adminUsers file:', error);
}
const nama = 'AnnaAi';
const author = 'AlfiXD';
const version = '1.0';


function registerFeatures(bot) {
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//
// start
bot.onText(new RegExp('^' + prefix + 'start'), (msg) => {
    const chatId = msg.chat.id;
    const sender = msg.from.username;
    let image = `https://raw.githubusercontent.com/Fiisya/uploads/main/uploads/1745036833446.jpeg`;
    let caption = `Halo Perkenalkan Saya Anna Ai Yang Dibuat Oleh @alfisyahrial Dengan Penerapan Dan Penggunaan Logika Dari Gemini`;
    
    /* bot.sendPhoto(chatId, image, { caption, parse_mode: "Markdown" }); */
    bot.sendMessage(chatId, caption);
});
//▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰//

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;
    const username = msg.from.username || "Unknown";
    const command = msg.text || "Non-text message";
    const prefixRegexStart = new RegExp('^' + prefix);
    const fs = require("fs");
    
      console.log(`[LOG INFORMATION!]\nUser: ${username}\nID: ${userId}\nperintah: ${command}`)
      
if (
    msg.chat.type !== "private" ||
    !autoGeminiDB.status ||
    userId === bot.id ||
    (msg.text && prefixRegexStart.test(msg.text))
  ) {
    return;
  }


  // Ensure session object is available
  autoGeminiDB.sessions = autoGeminiDB.sessions || {};
  if (!autoGeminiDB.sessions[userId]) {
    autoGeminiDB.sessions[userId] = [];
  }

  // --- CASE 1: Message in the form of a photo ---
  if (msg.photo) {
    // Use caption if available, or default prompt
    const promptText = msg.caption ? msg.caption : "Deskripsikan gambar ini";
    // Gabungkan dengan prompt sistem untuk memberikan konteks
    const systemPrompt = `${global.prompt}`;
    const fullPrompt = systemPrompt + promptText;
    
    // Save messages from users to sessions as a photo message representation
    autoGeminiDB.sessions[userId].push({ role: "user", content: `[IMAGE] ${promptText}` });
    
    // Get the fileId of the highest resolution image
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const filePath = await bot.downloadFile(fileId, "./downloads");
    if (!filePath) {
      bot.sendMessage(chatId, "❌ Gagal mengunduh foto.");
      return;
    }
    await bot.sendChatAction(chatId, "typing");
   // await sleep(500)
    bot.sendMessage(chatId, "⏳ Mengunggah dan memproses gambar...");
    
    try {
      // Upload photo files to the GoogleGenAI API
      const imageResponse = await aiGemini.files.upload({
        file: filePath,
      });
      
      // Create content with complete prompts and image data from the upload API.
      const contents = [
        createUserContent([
          fullPrompt,
          createPartFromUri(imageResponse.uri, imageResponse.mimeType)
        ])
      ];
      
      // Call the Gemini model
      const response = await aiGemini.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
      });
      
      const aiReply = response.text || "Tidak ada respons.";
      // Save AI replies to session
      autoGeminiDB.sessions[userId].push({ role: "assistant", content: aiReply });
      fs.writeFileSync(geminiDbFile, JSON.stringify(autoGeminiDB, null, 2));
      
      bot.sendMessage(chatId, aiReply);
    } catch (err) {
      console.error("Error processing image:", err);
      bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat memproses gambar.");
    }
    return;
  }
  
  // --- CASE 2: Text only messages ---

  // Only continue if there is text
  if (!msg.text) return;

  // 1️⃣ Classification intent image dengan Gemini AI
  let isImageRequest = false;
  try {
    const classifyPrompt = `
Apakah kalimat berikut meminta dibuatkan atau digenerate sebuah gambar (jawab hanya "yes" atau "no")?\n"${msg.text}"
    `.trim();

    const cls = await aiGemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: classifyPrompt,
    });
    if (cls.text.trim().toLowerCase().startsWith("yes")) {
      isImageRequest = true;
    }
  } catch (e) {
    console.error("Klasifikasi gagal:", e);
  }

  // 2️⃣ If intent = image, call the Deep Image Generator API
  if (isImageRequest) {
    // Parse prompt dan style: "prompt | style"
    let [promptText, styleText] = msg.text.split("|").map(s => s.trim());
    if (!promptText) promptText = msg.text.trim();
    const style = (styleText || "realistic").toLowerCase();

    await bot.sendChatAction(chatId, "upload_photo");
    bot.sendMessage(chatId, "⏳ Membuat gambar, mohon tunggu…");

    try {
      const deviceId = `dev-${Math.floor(Math.random() * 1e6)}`;
      const resp = await axios.post(
        'https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev',
        {
          prompt: `${promptText} -style ${style}`,
          size: "1024x1024",
          device_id: deviceId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://deepimg.ai',
            'Referer': 'https://deepimg.ai/'
          }
        }
      );

      const images = resp.data?.data?.images;
      if (images && images.length) {
        // Send only the first image (or loop for all)
        const url = images[0].url;
        await bot.sendPhoto(chatId, url, {
          caption: `✅ Gambar berhasil dibuat!\n\n*Prompt:* ${promptText}\n*Style:* ${style}`,
          parse_mode: "Markdown"
        });

        // Save prompt as memory image
        autoGeminiDB.sessions[userId].push({ role: "assistant", content: `[IMAGE] ${promptText} | ${style}` });
        fs.writeFileSync(geminiDbFile, JSON.stringify(autoGeminiDB, null, 2));
      } else {
        bot.sendMessage(chatId, "❌ Gagal mendapatkan gambar.");
      }
    } catch (err) {
      console.error("Error generating deep image:", err.response?.data || err.message);
      bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat membuat gambar.");
    }

    return; // finished branch image
  }

  // 3️⃣ Branch teks biasa (tidak image request)
  autoGeminiDB.sessions[userId].push({ role: "user", content: msg.text });
  const systemPrompt = `${global.prompt}`;
  const history = autoGeminiDB.sessions[userId].map(i => `${i.role}: ${i.content}`).join("\n");
  const contents = systemPrompt + "\n" + history;

  try {
    await bot.sendChatAction(chatId, "typing");
   // await sleep(2000);

    const reply = await aiGemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    const aiReply = reply.text || "Tidak ada respons.";
    autoGeminiDB.sessions[userId].push({ role: "assistant", content: aiReply });
    fs.writeFileSync(geminiDbFile, JSON.stringify(autoGeminiDB, null, 2));

    await bot.sendMessage(chatId, aiReply);
  } catch (err) {
    console.error("Error in autogeminiai:", err);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat menghubungi API Gemini AI.");
  }
});

    // Add more features here...
}

// Ekspor fungsi agar bisa digunakan di bot.js
module.exports = { registerFeatures };
