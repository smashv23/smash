const { cmd } = require('../command');
const os = require('os');
const { runtime } = require('../lib/functions');
const pkg = require('../package.json'); // Get version from package.json

cmd({
  pattern: "alive",
  alias: ["status", "runtime", "uptime"],
  desc: "Check uptime and system status",
  category: "main",
  react: "💋",
  filename: __filename
}, async (conn, mek, m, {
  from, sender, reply
}) => {
  try {
    const usedMemMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const up = runtime(process.uptime());

    const caption = `
╭━━〔 *𝐒𝐌𝐀𝐒𝐇-𝐕𝟏* 💥 〕━━╮
┃ ⚙️ *Bot Status Report* ⚙️
┃
┃ 🧬 *Version:* ${pkg.version}
┃ ⏱ *Uptime:* ${up}
┃ 🧠 *Memory:* ${usedMemMB} TB / ${totalMemGB} TB
┃ 🖥 *Host:* ${os.hostname()}
┃ 👑 *Owner:* ${global?.config?.OWNER_NAME || "loft"}
┃ 💖 *Framework:* *𝐒𝐌𝐀𝐒𝐇-𝐕𝟏* 💥
┃
╰━━━━━━━━━━━━━━━━━━━━╯
🔗 Stay Powered • Stay Sparked
`;

    await conn.sendMessage(from, {
      image: { url:'https://files.catbox.moe/osou52.jpg' },
      caption,
      gifPlayback: true,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363398106360290@newsletter',
          newsletterName: '*𝐒𝐌𝐀𝐒𝐇-𝐕𝟏* 💥',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("🔥 Error in .alive command:", e);
    reply(`❌ Error: ${e.message}`);
  }
});