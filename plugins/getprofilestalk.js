const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    desc: "📸 Fetch the profile picture of a user",
    react: "💥",
    category: "User",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, mentionByTag, quoted, sender, reply }) => {
    try {
        let target;

        if (isGroup) {
            if (mentionByTag && mentionByTag.length > 0) {
                target = mentionByTag[0];
            } else if (quoted) {
                target = quoted.sender;
            } else {
                target = sender;
            }
        } else {
            target = from;
        }

        if (!target) return reply("❗ Target user not found.");

        console.log("Target JID:", target);

        // Fix malformed JIDs
        if (!target.includes('@')) {
            target = target + '@s.whatsapp.net';
            console.log("Fixed Target JID:", target);
        }

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
            console.log("Profile Pic URL:", ppUrl);
        } catch (e) {
            console.log("❌ Error fetching profile picture:", e);
            return reply("🚫 Couldn’t access profile picture. The user might have none or restricted privacy settings.");
        }

        const name = await conn.getName(target);
        console.log("Fetched Name:", name);

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: `👤 *Profile Picture of ${name}*`,
            contextInfo: {
                mentionedJid: [target],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363200367779016@newsletter',
                    newsletterName: 'Silva MD Bot',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

    } catch (err) {
        console.error("❌ Uncaught Error in getpp:", err);
        reply("⚠️ An unexpected error occurred. Try again or report to the admin.");
    }
});