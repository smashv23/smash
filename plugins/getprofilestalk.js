const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    desc: "📸 Get the profile picture of a user",
    react: "🖼️",
    category: "User",
    filename: __filename
},
async (conn, mek, m, { from, mentionByTag, isGroup, reply, quoted, sender }) => {
    try {
        let user;

        if (isGroup) {
            user = mentionByTag && mentionByTag.length
                ? mentionByTag[0]
                : quoted
                    ? quoted.sender
                    : sender;
        } else {
            user = from;
        }

        const pp = await conn.profilePictureUrl(user, 'image');
        const name = await conn.getName(user);

        await conn.sendMessage(from, {
            image: { url: pp },
            caption: `👤 *Profile Picture of ${name}*`,
            contextInfo: {
                mentionedJid: [user],
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
        console.error(err);
        return reply("❌ Couldn't fetch profile picture. Maybe the user has no profile picture or their privacy settings are restricted.");
    }
});