const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');

// Rainbow color gradient for menus
const rainbow = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'];

// Fancy divider generator
const divider = (length = 20, char = '━') => {
  return char.repeat(length);
};

// Generate random emoji sequence
const randomEmoji = () => {
  const emojis = ['✨', '⚡', '🌟', '💫', '🎀', '🧿', '💠', '🔮', '🌈'];
  return emojis.sort(() => 0.5 - Math.random()).slice(0, 3).join('');
};

// Main Menu
cmd({
  pattern: "menu",
  desc: "Display the main menu",
  category: "menu",
  react: "💖",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const header = `
╔═*.·:·.✧ ✦ ✧.·:·.*═╗
   SILVA SPARK MD
╚═*.·:·.✧ ✦ ✧.·:·.*═╝

${rainbow.join('')} BOT INFORMATION ${rainbow.reverse().join('')}
👑 Owner » ${config.OWNER_NAME}
📱 Baileys » Multi Device
💻 Platform » ${os.platform()} ${os.arch()}
⚙️ Mode » ${config.MODE.toUpperCase()}
🔣 Prefix » [${config.PREFIX}]
🛠️ Version » 1.0.0
⏳ Runtime » ${runtime(process.uptime())}
${divider(30, '═')}

${rainbow.join('')} MAIN MENU CATEGORIES ${rainbow.reverse().join('')}
${randomEmoji()} » aimenu (AI Tools)
${randomEmoji()} » animemenu (Anime)
${randomEmoji()} » convertmenu (Converters)
${randomEmoji()} » funmenu (Fun Commands)
${randomEmoji()} » dlmenu (Downloaders)
${randomEmoji()} » groupmenu (Group Tools)
${randomEmoji()} » ownermenu (Owner Commands)
${randomEmoji()} » othermenu (Utilities)
${divider(30, '═')}

💡 Tip: Type ${config.PREFIX}help <command> for details
${config.DESCRIPTION}
    `;

    await conn.sendMessage(from, {
      image: { url: `https://files.catbox.moe/0vldgh.jpeg` },
      caption: header,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "SILVA SPARK MD ✨",
          body: "Ultimate WhatsApp Bot",
          thumbnail: await (await axios.get('https://files.catbox.moe/0vldgh.jpeg', { responseType: 'arraybuffer' })).data,
          mediaType: 1,
          mediaUrl: config.GITHUB || config.WEBSITE,
          sourceUrl: config.GITHUB || config.WEBSITE
        }
      }
    }, { quoted: mek });

    // Send audio
    await conn.sendMessage(from, {
      audio: { url: 'https://files.catbox.moe/a1sh4u.mp3' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: mek });
  } catch (e) {
    console.error('Menu Error:', e);
    reply(`❌ Error loading menu: ${e.message}`);
  }
});

// Download Menu
cmd({
  pattern: "dlmenu",
  desc: "Download commands menu",
  category: "menu",
  react: "💚",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const downloadMenu = `
╭━━━━━━━━━━━━━━━━━━━╮
  📥 DOWNLOAD MENU 📥
╰━━━━━━━━━━━━━━━━━━━╯

🌐 Social Media:
  • facebook » FB video download
  • tiktok » TikTok download
  • twitter » X/Twitter download
  • insta » Instagram download

🎵 Music/Video:
  • play » YT audio search
  • ytmp3 » YT to MP3
  • ytmp4 » YT to MP4
  • spotify » Spotify tracks

📁 Files:
  • mediafire » MediaFire DL
  • apk » APK download
  • git » GitHub repo DL
  • gdrive » Google Drive DL

🎬 Movies/Drama:
  • smovie » Search movies
  • darama » Asian dramas
  • baiscope » South Indian
  • ginisilia » TV series

${divider(30, '─')}
🔍 Usage: ${config.PREFIX}command <query>
    `;

    await sendMenu(conn, from, mek, m.sender, downloadMenu, 'Download Menu');
  } catch (e) {
    console.error('DL Menu Error:', e);
    reply(`❌ Error: ${e.message}`);
  }
});

// Group Menu
cmd({
  pattern: "groupmenu",
  desc: "Group commands menu",
  category: "menu",
  react: "🥰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const groupMenu = `
╭━━━━━━━━━━━━━━━━━━━╮
  🧑‍🤝‍🧑 GROUP MENU 🧑‍🤝‍🧑
╰━━━━━━━━━━━━━━━━━━━╯

🔧 Group Management:
  • add » Add users
  • kick » Remove user
  • promote » Make admin
  • demote » Remove admin
  • ginfo » Group info

⚙️ Group Settings:
  • setwelcome » Set welcome
  • setgoodbye » Set goodbye
  • updategname » Change name
  • updategdesc » Change desc

🔐 Privacy:
  • lockgc » Lock group
  • unlockgc » Unlock
  • disappear » Ephemeral
  • mute » Silence group

🏷️ Tagging:
  • tag » Mention user
  • hidetag » Hidden tag
  • tagall » Mention all
  • tagadmins » Tag admins

${divider(30, '─')}
⚠️ Admin privileges required
    `;

    await sendMenu(conn, from, mek, m.sender, groupMenu, 'Group Menu');
  } catch (e) {
    console.error('Group Menu Error:', e);
    reply(`❌ Error: ${e.message}`);
  }
});

// [Additional menu commands with similar formatting...]

// Helper function to send menus consistently
async function sendMenu(conn, from, mek, sender, text, title) {
  await conn.sendMessage(from, {
    image: { url: `https://files.catbox.moe/0vldgh.jpeg` },
    caption: text,
    contextInfo: {
      mentionedJid: [sender],
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {
        title: `SILVA SPARK - ${title}`,
        body: "Advanced WhatsApp Bot",
        thumbnail: await (await axios.get('https://files.catbox.moe/0vldgh.jpeg', { responseType: 'arraybuffer' })).data,
        mediaType: 1,
        sourceUrl: config.GITHUB || config.WEBSITE
      }
    }
  }, { quoted: mek });
}