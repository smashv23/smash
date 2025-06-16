const axios = require('axios');
const { cmd } = require('../command');
const fs = require('fs');
const os = require('os');

// Fetch bot version from package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = pkg.version || "1.0.0";

// Format uptime nicely
function formatUptime(ms) {
    const sec = Math.floor((ms / 1000) % 60);
    const min = Math.floor((ms / (1000 * 60)) % 60);
    const hr = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hr}h ${min}m ${sec}s`;
}

// Count total loaded commands
const commandCount = Object.keys(require.cache)
    .filter(p => p.includes('/commands/') || p.includes('\\commands\\'))
    .length;

// Define the command
cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "📦 Show full repo & runtime stats",
    category: "main",
    react: "🧑‍💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const repoUrl = 'https://api.github.com/repos/SilvaTechB/silva-md-bot';
        const { data } = await axios.get(repoUrl);
        const { stargazers_count, forks_count } = data;
        const estUsers = (stargazers_count + forks_count) * 5;

        const uptime = formatUptime(process.uptime() * 1000);
        const platform = os.platform().toUpperCase();
        const arch = os.arch().toUpperCase();

        const msg = `
┏━━━━━━━━━━━━━━━✦
┃ 🧠 *Silva Spark MD*
┃─────────────────
┃ 📎 *Repo:* github.com/SilvaTechB/silva-spark-md
┃ ⭐ Stars: ${stargazers_count}
┃ 🍴 Forks: ${forks_count}
┃ 👥 Users (Est): ${estUsers}
┃─────────────────
┃ 🛠 Version: v${version}
┃ 🧾 Commands: ${commandCount}
┃ 🕓 Uptime: ${uptime}
┃ 💻 System: ${platform} (${arch})
┗━━━━━━━━━━━━━━━✦

💖 *Thanks for using Silva Spark MD!*
📌 Fork ⭐ the project & join the journey!
🔗 Repo: https://github.com/SilvaTechB/silva-md-bot
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

        // Text message
        await conn.sendMessage(from, {
            text: msg,
            contextInfo: contextTag
        }, { quoted: mek });

        // Promo image
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/0vldgh.jpeg' },
            caption: "✨ *Silva Spark MD: Powering Smart Chats!* ✨\n\n📎 *Repo:* github.com/SilvaTechB/silva-spark-md\n⭐ Stars: ${stargazers_count}\n🍴 Forks: ${forks_count}\n👥 Users (Est): ${estUsers}",
            contextInfo: contextTag
        }, { quoted: mek });

        // Voice note response
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/hpwsi2.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Error:", err);
        reply(`🚫 *Oops!* Couldn't fetch repo info.\n\n🔧 ${err.message}`);
    }
});