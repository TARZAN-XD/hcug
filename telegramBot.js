require("dotenv").config();
const express = require("express");
const { createQR } = require("./whatsappQR");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TG_TOKEN);
const app = express();

app.use(express.json());

// 🛠️ إعداد Webhook:
const URL = process.env.RENDER_EXTERNAL_URL || "https://your-render-url.onrender.com";
bot.setWebHook(`${URL}/bot${process.env.TG_TOKEN}`);

// 📥 استقبال رسائل تيليجرام:
app.post(`/bot${process.env.TG_TOKEN}`, async (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 مرحبًا! أرسل رقمك لربط واتساب.");
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text.startsWith("+") || text.length < 10) return;

    bot.sendMessage(chatId, "⏳ جاري توليد QR Code...");

    try {
        const qrImageBuffer = await createQR(chatId, text);
        await bot.sendPhoto(chatId, qrImageBuffer, { caption: "✅ امسح هذا الكود من واتساب." });
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "❌ فشل توليد QR. حاول لاحقًا.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 سيرفر البوت يعمل على المنفذ ${PORT}`);
});
