const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

const commands = {};
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach((file) => {
    const cmdName = file.split(".")[0];
    commands[cmdName] = require(path.join(commandsPath, file));
});

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        browser: ["Tarzan", "Chrome", "10.0"],
        syncFullHistory: false
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        if (!messages || !messages[0]) return;

        const msg = messages[0];
        const fromMe = msg.key.fromMe;
        const chatId = msg.key.remoteJid;
        const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

        if (chatId.includes("status@broadcast")) return;

        const prefix = ".";
        if (body.startsWith(prefix)) {
            const command = body.slice(1).split(" ")[0].toLowerCase();
            const args = body.split(" ").slice(1).join(" ");

            console.log(`[CMD] ${command} → ${args} (FromMe: ${fromMe})`);

            if (commands[command]) {
                try {
                    await commands[command](sock, chatId, msg, args);
                } catch (err) {
                    console.error(`❌ خطأ في تنفيذ ${command}:`, err);
                    await sock.sendMessage(chatId, { text: "❌ حدث خطأ أثناء تنفيذ الأمر." });
                }
            }
        }
    });

    console.log("✅ تم تشغيل بوت واتساب بنجاح.");
}

startBot();
