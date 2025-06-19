const { Catbox } = require("node-catbox");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");

// Initialize Catbox uploader
const catbox = new Catbox();

cmd({
  pattern: "catbox",
  alias: ["uploadcat", "caturl", "catlink"],
  react: "📤",
  desc: "Upload quoted media (image/video/sticker/audio) to Catbox and return a sharable link.",
  category: "utility",
  filename: __filename
}, async (client, message, args, context) => {
  const { from, quoted, reply, sender } = context;

  try {
    const target = message.quoted ? message.quoted : message;
    const mime = (target.msg || target).mimetype || '';

    if (!mime || !/(image|video|audio)/.test(mime)) {
      return reply("🌻 Please reply to an image, video, audio, or sticker.");
    }

    // Download media and save temporarily
    const mediaBuffer = await target.download();
    const tempPath = path.join(os.tmpdir(), `catbox_${Date.now()}`);
    await fs.writeFile(tempPath, mediaBuffer);

    // Upload to Catbox
    const resultUrl = await catbox.uploadFile({ path: tempPath });

    if (!resultUrl) {
      throw "❌ Failed to upload to Catbox.";
    }

    // Clean up temp file
    await fs.unlink(tempPath);

    const contextInfo = {
      mentionedJid: [sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363200367779016@newsletter',
        newsletterName: "SILVA SPARK 🥰",
        serverMessageId: 0x94
      }
    };

    await client.sendMessage(from, {
      text: `✅ *Media Uploaded to Catbox!*\n\n📁 Size: ${(mediaBuffer.length / 1024).toFixed(2)} KB\n🔗 URL: ${resultUrl}`,
      contextInfo
    });

  } catch (err) {
    console.error("Catbox Upload Error:", err);
    reply("❌ Failed to upload. Reason: " + (err.message || err));
  }
});