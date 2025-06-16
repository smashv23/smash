const { cmd } = require("../command");

cmd({
  pattern: "antidelete",
  alias: [],
  desc: "Enable or disable anti-delete in this group or chat.",
  category: "group",
  use: ".antidelete on/off",
  filename: __filename
}, async (client, message, args, { reply }) => {
  // You can implement toggling logic for on/off here if you want
  reply("Antidelete is always enabled in Silva Spark MD!");
});

// --- Core antidelete logic ---

module.exports = async (client) => {
  // Listen for message delete events
  client.ev.on("messages.delete", async (item) => {
    try {
      const { remoteJid, fromMe, id, participant } = item;
      if (fromMe) return; // Ignore bot's own deleted messages

      // Try fetching the deleted message from the message store/cache
      const msg = client.messages.get(remoteJid)?.get(id);
      if (!msg) return;

      // Re-send the deleted message with a warning
      let text = `⚠️ *ANTI DELETE*\nA message was deleted by @${(participant || "").split("@")[0]}. Here it is:\n\n`;
      await client.sendMessage(remoteJid, { text, mentions: [participant] });

      // Re-send according to message type
      if (msg.message) {
        await client.sendMessage(remoteJid, msg.message, { quoted: msg });
      }
    } catch (e) {
      console.error("AntiDelete error:", e);
    }
  });
};