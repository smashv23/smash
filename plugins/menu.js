const config = require('../config'); const { cmd } = require('../command'); const os = require("os"); const { runtime } = require('../lib/functions');

const sendFancyMenu = async (conn, from, quoted, mek, m, dec, reaction) => { try { await conn.sendMessage(from, { image: { url: https://files.catbox.moe/0vldgh.jpeg }, caption: dec, contextInfo: { mentionedJid: [m.sender], forwardingScore: 999, isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: '120363200367779016@newsletter', newsletterName: 'SILVA SPARK MD 💖🦄', serverMessageId: 143 } } }, { quoted: mek });

if (reaction === "💖") {
  await conn.sendMessage(from, {
    audio: { url: 'https://files.catbox.moe/a1sh4u.mp3' },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: mek });
}

} catch (e) { console.log(e); conn.sendMessage(from, { text: ${e} }, { quoted: mek }); } };

const menus = [ { pattern: "menu", desc: "Main menu", category: "menu", react: "💖", title: "✦ Silva ✦ Spark ✦ MD ✦", subtitle: "Menu List", commands: [ "aimenu", "anmiemenu", "convertmenu", "funmenu", "dlmenu", "listcmd", "mainmenu", "groupmenu", "allmenu", "ownermenu", "othermenu", "logo <text>", "repo" ] }, { pattern: "dlmenu", desc: "Download menu", category: "menu", react: "💚", title: "Download Menu", subtitle: "Access various downloaders", commands: [ "facebook", "mediafire", "tiktok", "twitter", "Insta", "apk", "img", "spotify", "play", "play2", "play3", "tt2", "audio", "video", "video2", "ytmp3", "ytmp4", "song", "darama", "git", "gdrive", "smovie", "baiscope", "ginisilia" ] }, { pattern: "groupmenu", desc: "Group controls", category: "menu", react: "🥰", title: "Group Menu", subtitle: "Moderation & Admin Tools", commands: [ "grouplink", "kickall", "kickall2", "kickall3", "add", "remove", "kick", "promote", "demote", "dismiss", "revoke", "setgoodbye", "setwelcome", "delete", "getpic", "ginfo", "disappear on", "disappear off", "disappear 7D,24H", "allreq", "updategname", "updategdesc", "joinrequests", "senddm", "nikal", "mute", "unmute", "lockgc", "unlockgc", "invite", "tag", "hidetag", "tagall", "tagadmins" ] }, { pattern: "funmenu", desc: "Fun commands", category: "menu", react: "😎", title: "Fun Menu", subtitle: "Entertainment & Reactions", commands: [ "insult", "pickup", "ship", "character", "hack", "joke", "hrt", "hpy", "syd", "anger", "shy", "kiss", "mon", "cunfuzed", "setpp", "hand", "nikal", "hold", "hug", "hifi", "poke" ] }, { pattern: "othermenu", desc: "Miscellaneous tools", category: "menu", react: "🤖", title: "Other Menu", subtitle: "Extras & Tools", commands: [ "vv", "pair", "pair2", "fact", "font", "define", "news", "movie", "weather", "srepo", "insult", "save", "wikipedia", "gpass", "githubstalk", "yts", "ytv" ] } ];

menus.forEach(({ pattern, desc, category, react, title, subtitle, commands }) => { cmd({ pattern, desc, category, react, filename: __filename }, async (conn, mek, m, extras) => { const menuText = ╭━━〔 *${title}* 〕━━┈⊷\n + ┃✦ *Owner:* ${config.OWNER_NAME}\n + ┃✦ *Platform:* Heroku • NodeJs\n + ┃✦ *Mode:* [${config.MODE}] | Prefix: [${config.PREFIX}]\n + ┃✦ *Version:* 1.0.0\n + ┃✦ *Bot:* Multi-device\n + ┃✦ *${subtitle}*\n┃◈╭─────────────·๏\n + commands.map(cmd => ┃◈┃• ${cmd}).join("\n") + \n┃◈└───────────┈⊷\n╰──────────────┈⊷\n> ${config.DESCRIPTION};

await sendFancyMenu(conn, extras.from, mek, mek, m, menuText, react);

}); });

