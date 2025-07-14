const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const qrcode = require("qrcode");

async function createQR(sessionId, phoneNumber) {
    const sessionFile = `./sessions/${sessionId}.json`;
    const { state, saveState } = await useSingleFileAuthState(sessionFile);

    return new Promise((resolve, reject) => {
        const sock = makeWASocket({
            logger: pino({ level: "silent" }),
            auth: state,
            printQRInTerminal: false,
            browser: ["Telegram QR", "Chrome", "10.0"]
        });

        sock.ev.on("creds.update", saveState);

        sock.ev.on("connection.update", async ({ connection, qr }) => {
            if (qr) {
                const qrImage = await qrcode.toBuffer(qr);
                resolve(qrImage);
            }

            if (connection === "open") {
                console.log("✅ تم الربط!");
            }

            if (connection === "close") {
                reject("❌ تم إغلاق الاتصال قبل الربط");
            }
        });
    });
}

module.exports = { createQR };
