require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { createQR } = require("./whatsappQR");

const bot = new TelegramBot(process.env.TG_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "👋 مرحبًا! أرسل رقمك (مع كود الدولة) لتوليد رمز QR لربط واتساب.");
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text.startsWith("+") || text.length < 10) return;

    bot.sendMessage(chatId, "⏳ جاري توليد QR Code...");

    try {
        const qrImageBuffer = await createQR(chatId, text);
        await bot.sendPhoto(chatId, qrImageBuffer, { caption: "✅ امسح هذا الكود من واتساب لربط الجلسة." });
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, "❌ فشل توليد QR. حاول لاحقًا.");
    }
});
