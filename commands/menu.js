async function menu(sock, chatId) {
    const text = `
💬 قائمة الأوامر:
———————————————
.menu - عرض هذه القائمة
.pair <رقم> - توليد رمز اقتران
.bugvip - عرض قائمة BUG VIP
———————————————
🔐 @Tarzan-XD
`;
    await sock.sendMessage(chatId, { text });
}

module.exports = menu;
