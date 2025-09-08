const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const settings = require('./settings');
const { registerFeatures } = require('./bot');

// Get bot token from settings.js
const botToken = global.token
const bot = new TelegramBot(botToken, { polling: true });

// Bot start time information
console.log("✅ Telegram bot is running!");

// Call all features from features.js
registerFeatures(bot);

const admin = global.adminId

bot.sendMessage(`5793272507`, `Connected Bot`);