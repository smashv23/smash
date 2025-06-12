const fs = require('fs');

let deletedMessages = {};

module.exports = {
  name: 'antidelete',
  disabled: false, // set to true to turn off
  type: 'system',
  async before(m, { conn }) {
    const jid = m.key.remoteJid;
    const id = m.key.id;

    if (!m.message || m.key.fromMe) return;

    if (!deletedMessages[jid]) deletedMessages[jid] = {};
    deletedMessages[jid][id] = m;

    // Optional: cleanup
    if (Object.keys(deletedMessages[jid]).length > 50) {
      const firstKey = Object.keys(deletedMessages[jid])[0];
      delete deletedMessages[jid][firstKey];
    }
  },
  async afterDeleted(messageUpdate, conn) {
    for (const update of messageUpdate) {
      if (update.update && update.update.status === 'revoked') {
        const key = update.key;
        const jid = key.remoteJid;
        const id = key.id;
        const participant = key.participant || jid;

        if (
          deletedMessages[jid] &&
          deletedMessages[jid][id] &&
          deletedMessages[jid][id].message
        ) {
          const msgData = deletedMessages[jid][id];
          const type = Object.keys(msgData.message)[0];

          let caption = `🚫 *Anti-Delete Alert!*\n👤 *Sender:* ${msgData.pushName || 'Unknown'}\n💬 *Type:* ${type}\n🕒 *Time:* ${new Date().toLocaleString()}`;

          // Send notice and restored message
          await conn.sendMessage(jid, { text: caption });
          await conn.sendMessage(jid, msgData.message, {
            quoted: msgData,
          });

          delete deletedMessages[jid][id];
        }
      }
    }
  },
};