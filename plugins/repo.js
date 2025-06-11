const axios = require('axios');
const { cmd } = require('../command');
const fs = require('fs');
const os = require('os');

// Read package version
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = pkg.version || "1.0.0";

// Uptime formatter
function formatUptime(ms) {
    let sec = Math.floor((ms / 1000) % 60);
    let min = Math.floor((ms / (1000 * 60)) % 60);
    let hr = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hr}h ${min}m ${sec}s`;
}

// Count commands (plugin files)
const commandCount = Object.keys(require.cache)
    .filter(path => path.includes('/commands/') || path.includes('\\commands\\'))
    .length;

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Show Silva Spark MD repository details",
    category: "main",
    react: "👨‍💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // GitHub repo stats
        const { data } = await axios.get('https://api.github.com/repos/SilvaTechB/silva-md-bot');
        const { stargazers_count, forks_count } = data;
        const users = Math.round((stargazers_count + forks_count) * 5); // ×5 stats

        const uptime = formatUptime(process.uptime() * 1000);
        const platform = os.platform().toUpperCase();
        const arch = os.arch().toUpperCase();

        const msg = `
┏━━━『 *👨‍💻 Silva Spark MD Info* 』━━━✦
┃ 🔗 *Repo*: 
┃   github.com/SilvaTechB/silva-spark-md
┃ 
┃ ⭐ *Stars*: ${stargazers_count}
┃ 🍴 *Forks*: ${forks_count}
┃ 👥 *Est. Users*: ${users}
┃ 
┃ ⚙️ *Version*: v${version}
┃ 📊 *Commands*: ${commandCount}
┃ 🕓 *Uptime*: ${uptime}
┃ 💽 *System*: ${platform} (${arch})
┗━━━━━━━━━━━━━━━━━━━━━━✦

✨ *Silva Spark MD* – your feature-packed WhatsApp bot for automation, fun, and more!

📌 *Main MD Repo*:
https://github.com/SilvaTechB/silva-md-bot

💡 *Tip*: Fork & ⭐ to show love!
💖 Thanks for choosing Silva Spark MD!
        `.trim();

        const contextTag = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363200367779016@newsletter',
                newsletterName: 'SILVA SPARK MD 💖🦄',
                serverMessageId: 143
            }
        };

        // Send the repo stats text with forward tag
        await conn.sendMessage(from, {
            text: msg,
            contextInfo: contextTag
        }, { quoted: mek });

        // Send a related image with forward tag
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/0vldgh.jpeg` },
            caption: "🌟 *Silva Spark MD: Powering smart chats everywhere!*",
            contextInfo: contextTag
        }, { quoted: mek });

        // Send the audio response (voice note)
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/hpwsi2.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Repo Fetch Error:", err);
        reply(`🚫 *Error fetching repo data:*\n${err.message}`);
    }
});