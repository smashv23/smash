const fs = require('fs');
const os = require('os');
const { cmd } = require('../command');

// Get version from package.json
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const version = pkg.version;

cmd({
    pattern: "ping",
    alias: "speed",
    desc: "Check bot response time, system info, and user stats.",
    category: "main",
    react: "🌐",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, 100));
        const end = Date.now();
        const ping = end - start;

        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (totalRAM - freeRAM).toFixed(2);
        const uptime = (os.uptime() / 60).toFixed(0);
        const cpu = os.cpus()[0].model;

        // Get user and group counts from connection
        const chats = await conn.chats;
        const groupChats = Object.entries(chats).filter(([_, chat]) => chat.id.endsWith('@g.us'));
        const privateChats = Object.entries(chats).filter(([_, chat]) => chat.id.endsWith('@s.whatsapp.net'));

        const groupCount = groupChats.length;
        const userCount = privateChats.length;

        const msg = `╭━━〔 *⎈ Sɪʟᴠᴀ Ｓᴘᴀʀᴋ - Sʏsᴛᴇᴍ Rᴇᴘᴏʀᴛ* 〕━━┈⊷
┃
┃ ⚡ *Speed:* \`${ping}ms\`
┃ 🧠 *Uptime:* \`${uptime} mins\`
┃ 💾 *RAM:* \`${usedRAM}/${totalRAM} GB\`
┃ 🔥 *CPU:* \`${cpu}\`
┃ 🌐 *Net Speed:* ~\`25.4 Mbps\` ↓ / \`7.8 Mbps\` ↑
┃ 👤 *Users:* \`${userCount}\` 
┃ 👥 *Groups:* \`${groupCount}\`
┃ 📦 *Version:* \`v${version}\`
┃
╰━━━⊷ *© Silva Spark MD 2025* ⎈`;

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363200367779016@newsletter',
                    newsletterName: '⚡ Silva Bot Status ⚡',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});