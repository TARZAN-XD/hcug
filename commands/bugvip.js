async function bugvipCommand(sock, chatId, message, q) {
    const response = `
╭──────•【🔥𝗩𝗜𝗣 𝗕𝗨𝗚🔥】•──────╮
│🚀 بوتات تهكير رقم واتساب
│🛡️ حماية - ⛓️ اختراق - 💥 دمار
│
│📌 الأمر: .pair +966XXXXXXX
│🎯 يتم إرسال كود اختراق الرقم
│⚠️ لا تستعملها عشوائيًا
│
│🧠 صنع بواسطة: @TARZAN_XD
╰──────•【🔥 𝗕𝗨𝗚 𝗕𝗬 𝗧𝗔𝗥𝗭𝗔𝗡 🔥】•──────╯
`;

    await sock.sendMessage(chatId, {
        text: response,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true
        }
    });
}

module.exports = bugvipCommand;
