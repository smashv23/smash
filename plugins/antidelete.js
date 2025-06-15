const { cmd } = require('../command');

// Toggle to enable or disable antidelete
let ANTIDELETE_PRIVATE = true;

cmd({
  pattern: 'antidelete',
  alias: ['antidel'],
  desc: 'Toggle Anti-delete feature',
  category: 'moderation',
  react: '🛡️',
  filename: __filename
}, async (m, text, { reply }) => {
  ANTIDELETE_PRIVATE = !ANTIDELETE_PRIVATE;
  reply(`🛡️ Anti-delete is now *${ANTIDELETE_PRIVATE ? "ENABLED" : "DISABLED"}*`);
});

// Listen for deleted messages
mek.ev.on('messages.delete', async (msg) => {
  if (!ANTIDELETE_PRIVATE) return;

  for (const deletion of msg) {
    try {
      const { remoteJid, fromMe, id } = deletion.key;
      if (!remoteJid || fromMe || !id) continue;

      const chat = mek.chats.get(remoteJid);
      if (!chat) continue;

      const originalMsg = chat.messages.get(id);
      if (!originalMsg || !originalMsg.message) continue;

      const sender = originalMsg.key.participant || originalMsg.key.remoteJid;
      const senderName = mek.contacts[sender]?.name || sender;

      let type = Object.keys(originalMsg.message)[0];
      let caption = `🗑️ *Anti-Delete*\n👤 *Sender:* ${senderName}\n📩 *Recovered ${type} message*`;

      if (type === 'conversation' || type === 'extendedTextMessage') {
        const text = originalMsg.message[type]?.text || originalMsg.message[type]?.extendedText;
        await mek.sendMessage(remoteJid, {
          text: `${caption}\n\n💬 ${text}`,
          contextInfo: { mentionedJid: [sender] }
        });
      } else {
        await mek.copyNForward(remoteJid, originalMsg, true);
        await mek.sendMessage(remoteJid, {
          text: caption,
          contextInfo: { mentionedJid: [sender] }
        });
      }

      console.log(`✅ [ANTIDELETE] Message of type '${type}' recovered from ${senderName} (${sender}) in ${remoteJid}`);
    } catch (err) {
      console.error('❌ [ANTIDELETE] Error recovering message:', err);
    }
  }
});