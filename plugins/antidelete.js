const moment = require("moment-timezone");

const deletedMessages = {};

const antideleteGroups = process.env.ANTIDELETE_GROUPS?.toLowerCase() === "true";
const antideletePrivate = process.env.ANTIDELETE_PRIVATE?.toLowerCase() === "true";

module.exports = {
  name: "antidelete",

  /**
   * ✅ Store all incoming messages
   */
  async afterReceive(m) {
    if (!m.message || m.key?.remoteJid === "status@broadcast") return;

    const chat = m.key.remoteJid;
    const msgId = m.key.id;

    if (!deletedMessages[chat]) deletedMessages[chat] = {};
    deletedMessages[chat][msgId] = m;
  },

  /**
   * 🔄 Restore deleted messages
   */
  async beforeDelete(m, { conn }) {
    if (!m.key || !m.key.remoteJid || m.key?.remoteJid === "status@broadcast") return;

    const chat = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const msgId = m.key.id;

    // Skip based on settings
    if (chat.endsWith("@g.us") && !antideleteGroups) return;
    if (!chat.endsWith("@g.us") && !antideletePrivate) return;

    const original = deletedMessages[chat]?.[msgId];
    if (!original) return;

    const name = conn.getName(sender);
    const time = moment.tz("Africa/Nairobi").format("dddd, MMMM Do YYYY, h:mm:ss A");

    await conn.sendMessage(chat, {
      text:
        `🛡️ *Antidelete Activated!*\n` +
        `——————————————\n` +
        `👤 *Sender:* @${sender.split("@")[0]}\n` +
        `🕒 *Time:* ${time}\n` +
        `📩 *Recovered Message:*`,
      mentions: [sender],
    });

    await conn.copyNForward(chat, original, true);
  },
};