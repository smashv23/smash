const { smd, tlang, botpic, prefix, Config, bot_ } = require("../lib");
let DELCHAT = process.env.DELCHAT || 'pm';

smd({
  handler: "antidelete",
  tags: ["general"],
  command: ["antidelete", "delete"],
  desc: "Turn On/Off auto download deletes",
  use: "<on/off>",
  filename: __filename
}, async (message, match) => {
  try {
    let userId = `bot_${message.user}`;
    let botData = await bot_.findOne({ id: userId }) || await bot_.create({ id: userId });

    let action = match.toLowerCase().trim();
    if (["on", "enable", "act"].includes(action)) {
      if (botData.antidelete === "true") {
        return await message.reply("*Anti_Delete is already enabled!*");
      }
      await bot_.updateOne({ id: userId }, { antidelete: "true" });
      return await message.reply("*Anti_Delete has been successfully enabled!*");
    } else if (["off", "disable", "deact"].includes(action)) {
      if (botData.antidelete === "false") {
        return await message.reply("*Anti_Delete is already disabled!*");
      }
      await bot_.updateOne({ id: userId }, { antidelete: "false" });
      return await message.reply("*Anti_Delete has been successfully disabled!*");
    } else {
      return await message.reply("*Use 'on' or 'off' to enable/disable Anti_Delete!*");
    }
  } catch (error) {
    console.error("Error in antidelete command:", error);
    await message.reply("An error occurred. Please try again later.");
  }
});

smd({
  on: "delete"
}, async (message, match, { store }) => {
  try {
    let userId = `bot_${message.user}`;
    let botData = await bot_.findOne({ id: userId });

    if (botData && botData.antidelete === "true") {
      let sender = message.msg.key.participant || (message.msg.key.fromMe ? message.user : message.msg.key.remoteJid);
      let chatMessages = store.messages[message.from] || [];
      chatMessages = [...chatMessages, ...store.messages[message.from].array];

      for (let msg of chatMessages) {
        if (msg.key.id === message.msg.key.id) {
          await message.bot.sendMessage(message.from, {
            text: `*[ANTIDELETE DETECTED]*\n\n*Deleted Message Recovered*:\n${msg.message.conversation || "Media/Unsupported Message"}`,
            mentions: [sender]
          });
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error in delete event:", error);
  }
});
