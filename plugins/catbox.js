const { Catbox } = require("node-catbox");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const { cmd } = require("../command");

const catbox = new Catbox();

cmd({
  pattern: "catbox",
  alias: ["uploadcat", "caturl", "catlink"],
  react: "📤",
  desc: "Upload quoted media to Catbox and return a shareable link.",
  category: "utility",
  filename: __filename
}, async (client, m, args, context) => {
  const { from, quoted, reply, sender } = context;

  try {
    if (!quoted) return reply("❌ Please quote an image, video, audio, or sticker to upload.");

    const mime = (quoted.msg || quoted).mimetype || '';
    if (!mime || !/(image|video|audio)/.test(mime)) {
      return reply("❌ Unsupported media. Quote an image, video, or audio.");
    }

    // Download media
    const mediaBuffer = await quoted.download();
    if (!mediaBuffer) return reply("❌ Failed to download media.");

    const tempPath = path.join(os.tmpdir(), `silva-catbox-${Date.now()}`);
    await fs.writeFile(tempPath, mediaBuffer);

    // Upload to Catbox
    const uploadedUrl = await catbox.uploadFile({ path: tempPath });
    await fs.unlink(tempPath); // clean up

    if (!uploadedUrl || typeof uploadedUrl !== "string") {
      throw new Error("Upload returned an invalid response.");
    }

    const contextInfo = {
      mentionedJid: [sender],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363200367779016@newsletter",
        newsletterName: "SILVA SPARK 🥰",
        serverMessageId: 0x94
      }
    };

    await client.sendMessage(from, {
      text: `✅ *Uploaded to Catbox!*\n\n🔗 URL: ${uploadedUrl}`,
      contextInfo
    });

  } catch (err) {
    console.error("Catbox Upload Error:", err);
    return reply("❌ Failed to upload.\n\nReason: " + (err.message || err));
  }
});