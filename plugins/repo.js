const axios = require('axios');
const { cmd } = require('../command');

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
        // Fetch live repo data from GitHub
        const { data } = await axios.get('https://api.github.com/repos/SilvaTechB/silva-md-bot');
        const { stargazers_count, forks_count } = data;
        const userCount = Math.round((stargazers_count + forks_count) * 2.5);

        // Stylish message
        const msg = `
┏━━━『 *👨‍💻 Silva Spark MD Info* 』━━━✦
┃ 🔗 *GitHub*: 
┃  https://github.com/SilvaTechB/silva-spark-md
┃ 
┃ ⭐ *Stars*: ${stargazers_count}
┃ 🍴 *Forks*: ${forks_count}
┃ 👥 *Est. Users*: ${userCount}
┗━━━━━━━━━━━━━━━━━━━━━━✦

✨ *Silva Spark MD* is your all-in-one WhatsApp automation bot — 
easy to use, smart, and open source!

📌 *Original MD Repo*: 
https://github.com/SilvaTechB/silva-md-bot

💡 *Pro Tip*: Fork it, star it ⭐, and contribute to the Spark!
🎉 *Thanks for supporting Silva Spark MD*!
        `.trim();

        // Send main message with buttons
        await conn.sendMessage(from, {
            text: msg,
            footer: "💖 Powered by Silva Tech Inc.",
            buttons: [
                { buttonId: "repo", buttonText: { displayText: "🔄 Refresh Repo" }, type: 1 },
                { buttonId: "menu", buttonText: { displayText: "📜 Main Menu" }, type: 1 }
            ],
            headerType: 1
        }, { quoted: mek });

        // Send a matching image
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/0vldgh.jpeg` },
            caption: "🚀 *Silva Spark MD – Revolutionizing WhatsApp Automation!*",
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

        // Send a fancy voice note (PTT)
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/hpwsi2.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Repo Fetch Error:", err);
        reply(`🚫 *Could not fetch repo info.*\n\n_Reason_: ${err.message}`);
    }
});