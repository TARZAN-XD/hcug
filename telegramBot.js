require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { createQR } = require("./whatsappQR");

const bot = new TelegramBot(process.env.TG_TOKEN);
const app = express();
app.use(express.json());

const URL = process.env.RENDER_EXTERNAL_URL;
bot.setWebHook(`${URL}/bot${process.env.TG_TOKEN}`);

app.post(`/bot${process.env.TG_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 أرسل رقمك مع كود الدولة لتوليد كود QR.");
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text.startsWith("+") || text.length < 10) return;

    bot.sendMessage(chatId, "⏳ جاري توليد كود QR...");

    try {
        const qrImageBuffer = await createQR(chatId, text);
        await bot.sendPhoto(chatId, qrImageBuffer, { caption: "✅ امسح هذا الكود من واتساب." });
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "❌ فشل في توليد الكود.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook Bot شغّال على المنفذ ${PORT}`);
});
