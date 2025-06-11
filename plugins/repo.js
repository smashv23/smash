const axios = require('axios');
const { cmd } = require('../command');
const fs = require('fs');
const os = require('os');

// Read package version
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = pkg.version || "1.0.0";

// Uptime helper
function formatUptime(ms) {
    let sec = Math.floor((ms / 1000) % 60);
    let min = Math.floor((ms / (1000 * 60)) % 60);
    let hr = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hr}h ${min}m ${sec}s`;
}

// Count available commands
const commandCount = Object.keys(require.cache)
    .filter(path => path.includes('/commands/') || path.includes('\\commands\\'))
    .length;

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Showcase Silva Spark MD repository details",
    category: "main",
    react: "👨‍💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // GitHub repo stats
        const { data } = await axios.get('https://api.github.com/repos/SilvaTechB/silva-md-bot');
        const { stargazers_count, forks_count } = data;
        const users = Math.round((stargazers_count + forks_count) * 2.5);

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

✨ *Silva Spark MD* – the smart WhatsApp bot built for speed, style, and stability.

📌 *Original MD Repo*:
https://github.com/SilvaTechB/silva-md-bot

🧠 *Tip*: Fork & ⭐ to support!
💖 Thanks for using Silva Spark MD!
        `.trim();

        // Text reply
        await conn.sendMessage(from, { text: msg }, { quoted: mek });

        // Fancy image
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/0vldgh.jpeg` },
            caption: "🌟 *Your smart WhatsApp bot companion!*",
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363200367779016@newsletter',
                    newsletterName: 'SILVA SPARK MD 💖🦄',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Audio PTT
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