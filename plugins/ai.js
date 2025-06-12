const { cmd } = require("../command");
const { fetchJson } = require("../lib/functions");

cmd({
  pattern: 'ai',
  alias: ["gpt", "bot"],
  react: '🧠',
  desc: "AI chat using LLaMa model",
  category: "main",
  filename: __filename
}, async (m, commandInfo, messageData, {
  q,
  reply
}) => {
  try {
    if (!q) return reply("📝 Please provide a prompt. Example: `.ai What is life?`");

    const apiUrl = `https://api.gurusensei.workers.dev/llama?prompt=${encodeURIComponent(q)}`;
    const response = await fetchJson(apiUrl);

    if (!response || !response.data) {
      return reply("❌ Failed to get a response. Try again later.");
    }

    reply(response.data);
  } catch (error) {
    console.error("AI Chat Error:", error);
    reply("⚠️ An error occurred while generating a response.");
  }
});