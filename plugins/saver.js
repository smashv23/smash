const { cmd, commands } = require("../command");
const path = require('path');

cmd({
  pattern: "save",
  react: '📁',
  alias: ["store"],
  desc: "Save and send back a media file (image, video, or audio).",
  category: "media",
  use: ".save <caption>",
  filename: __filename
}, async (client, message, args, { quoted, q, reply }) => {
  try {
    if (!quoted) {
      return reply("❌ Reply to a media message (video, image, or audio) with the `.save` command.");
    }

    const mediaType = quoted.mtype;
    let type;
    if (/video/.test(mediaType)) {
      type = "video";
    } else if (/image/.test(mediaType)) {
      type = "image";
    } else if (/audio/.test(mediaType)) {
      type = "audio";
    } else {
      return reply("❌ Only video, image, or audio messages are supported.");
    }

    // Download and save the media file
    const filePath = await client.downloadAndSaveMediaMessage(quoted);
    if (!filePath) {
      return reply("❌ Failed to download the media.");
    }
    const resolvedPath = path.resolve(filePath);

    // Prepare message object
    const messageObj = {
      caption: q || ''
    };
    messageObj[type] = { url: 'file://' + resolvedPath };

    // Send the media back
    await client.sendMessage(message.sender, messageObj, { quoted: message });

    return reply("✅ S♥I♥L♥V♥A♥ ♥S♥P♥A♥R♥K Successfully saved and sent the media file.");
  } catch (error) {
    console.error(error);
    return reply("❌ Failed to save and send the media. Please try again.");
  }
});