const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    desc: "📸 Fetch the profile picture of a user",
    react: "🖼️",
    category: "User",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, mentionByTag, quoted, sender, reply }) => {
    try {
        // Identify target user
        const target = isGroup
            ? mentionByTag?.[0] || quoted?.sender || sender
            : from;

        // Try to fetch profile picture
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch {
            return reply("🚫 Unable to access profile picture. They may not have one, or their privacy settings restrict it.");
        }

        // Get name for caption
        const name = await conn.getName(target);

        // Send the profile picture
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: `👤 *Profile Picture of ${name}*`,
            contextInfo: {
                mentionedJid: [target],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363200367779016@newsletter',
                    newsletterName: 'Silva Bots',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error("❌ Error in .getpp command:", err);
        reply("⚠️ An unexpected error occurred. Please try again later.");
    }
});