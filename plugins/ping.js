const { cmd } = require('../command');
const config = require('../config');
const pkg = require('../package.json');
const os = require('os');
const moment = require('moment-timezone');

cmd({
  pattern: "ping",
  alias: ["speed", "system"],
  desc: "⚙️ Show bot performance & system info",
  category: "main",
  react: "⚡",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const start = Date.now();

    // Send a temporary loading message
    const loading = await conn.sendMessage(from, {
      text: `🔍 *Checking Silva Spark Systems...*`
    }, { quoted: mek });

    const end = Date.now();
    const ping = end - start;

    // Uptime
    const uptimeSeconds = process.uptime();
    const uptime = moment.utc(uptimeSeconds * 1000).format("HH:mm:ss");

    // CPU & RAM info
    const cpu = os.cpus()[0].model;
    const totalRAM = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeRAM = (os.freemem() / (1024 ** 3)).toFixed(2);
    const usedRAM = (totalRAM - freeRAM).toFixed(2);

    // Time
    const timeNairobi = moment().tz('Africa/Nairobi').format('HH:mm:ss A');

    const version = pkg.version || "2.0.0";

    // Final response
    await conn.sendMessage(from, {
      text: 
`╭━━━〔 ⚡ *Sɪʟᴠᴀ Ｓᴘᴀʀᴋ мᎠ* ⚡ 〕━━━┈⊷
┃ 🕒 *Time:* ${timeNairobi}
┃ ⚡ *Ping:* ${ping}ms
┃ 🔋 *Uptime:* ${uptime}
┃ 🧠 *AI Status:* Online
┃ 💾 *RAM:* ${usedRAM} GB / ${totalRAM} GB
┃ 💻 *CPU:* ${cpu}
┃ 📌 *Version:* ${version}
┃ 👤 *Owner:* ${config.OWNER_NAME}
╰━━━━━━━━━━━━━━━━━━━━━⊷

✨ _Silva Spark is sparking at full power!_  
> _Stay cool, stay connected_ 💖

⚠️ *Ethical Use Only*
🔗 *Join Newsletter:* SILVA SPARKING SPEED 🥰🥰`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363200367779016@newsletter',
          newsletterName: 'SILVA SPARKING SPEED 🥰🥰',
          serverMessageId: 143
        }
      }
    }, { quoted: loading });

  } catch (err) {
    console.error("❌ PING SYSTEM ERROR:", err);
    reply(`❌ *An error occurred:* ${err.message}`);
  }
});