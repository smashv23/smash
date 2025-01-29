const { cmd } = require('../command');
const yts = require('yt-search');
const { fetchJson } = require("../lib/functions");
const axios = require("axios");

/**
 * Fetch direct YouTube video/audio download link.
 * @param {string} url - The YouTube video URL.
 * @param {string} format - Video quality (e.g., "360p", "720p").
 * @returns {Promise<string>} - Direct download link.
 */
async function downloadYouTube(url, format) {
    try {
        if (!url || !format) throw new Error("URL and format are required.");

        const quality = parseInt(format.replace('p', ''), 10);
        const params = { button: 1, start: 1, end: 1, format: quality, url };
        const headers = { 'User-Agent': "Mozilla/5.0 (Linux; Android 10) Chrome/124.0.0.0" };

        // Fetch video ID
        const response = await axios.get("https://ab.cococococ.com/ajax/download.php", { params, headers });
        const videoId = response.data.id;

        // Poll for download completion
        async function checkProgress() {
            try {
                const progressResponse = await axios.get("https://p.oceansaver.in/ajax/progress.php", {
                    params: { id: videoId },
                    headers
                });

                const { download_url, text } = progressResponse.data;
                return text === 'Finished' ? download_url : (await new Promise(res => setTimeout(res, 1000)), checkProgress());
            } catch (error) {
                throw new Error("Progress check failed: " + error.message);
            }
        }

        return await checkProgress();
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

/**
 * Extracts YouTube video ID from a URL.
 * @param {string} url - YouTube video URL.
 * @returns {string|null} - Extracted video ID.
 */
function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Converts a YouTube URL to a standard format.
 * @param {string} url - YouTube URL.
 * @returns {string} - Standardized URL.
 */
function normalizeYouTubeLink(url) {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}

/**
 * Command: 🎵 Download YouTube Audio (MP3)
 */
cmd({
    pattern: 'song',
    alias: "play",
    desc: "🎧 Download songs from YouTube",
    react: '🎶',
    category: 'download',
    filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a YouTube URL or title.");

        const searchResults = await yts(normalizeYouTubeLink(q));
        const video = searchResults.videos[0];
        if (!video) return reply("⚠️ No video found.");

        const downloadLink = await fetchJson(`https://www.dark-yasiya-api.site/download/ytmp3?url=${video.url}`);
        await bot.sendMessage(from, { audio: { url: downloadLink.result.dl_link }, mimetype: "audio/mpeg" }, { quoted: message });
    } catch (error) {
        console.error(error);
        reply("⚠️ Error processing request.");
    }
});

/**
 * Command: 🎥 Download YouTube Video (MP4)
 */
cmd({
    pattern: "video",
    desc: "📽️ Download YouTube videos",
    react: '🎬',
    category: "download",
    filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a YouTube URL or title.");

        const searchResults = await yts(normalizeYouTubeLink(q));
        const video = searchResults.videos[0];
        if (!video) return reply("⚠️ No video found.");

        // Display quality options
        let qualityOptions = `🎬 *Select video quality:*\n\n` +
            `1️⃣ 360p\n` +
            `2️⃣ 480p\n` +
            `3️⃣ 720p\n` +
            `4️⃣ 1080p\n\n` +
            `📂 *Download as Document:*\n` +
            `5️⃣ 360p\n` +
            `6️⃣ 480p\n` +
            `7️⃣ 720p\n` +
            `8️⃣ 1080p\n\n` +
            `🔹 Reply with a number to choose.`;

        const selectionMessage = await bot.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: qualityOptions
        }, { quoted: message });

        const selectionMessageId = selectionMessage.key.id;

        // Capture user selection
        bot.ev.on('messages.upsert', async (msg) => {
            const receivedMsg = msg.messages[0];
            if (!receivedMsg.message) return;

            const userResponse = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const senderId = receivedMsg.key.remoteJid;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === selectionMessageId;

            if (isReplyToBot) {
                let quality;
                switch (userResponse) {
                    case "1": quality = "360p"; break;
                    case "2": quality = "480p"; break;
                    case "3": quality = "720p"; break;
                    case "4": quality = "1080p"; break;
                    case "5": quality = "360p"; break;
                    case "6": quality = "480p"; break;
                    case "7": quality = "720p"; break;
                    case "8": quality = "1080p"; break;
                    default:
                        return await reply("❌ Invalid selection. Try again.");
                }

                const downloadUrl = await downloadYouTube(video.url, quality);
                if (!downloadUrl) return reply("⚠️ Download failed.");

                if (["5", "6", "7", "8"].includes(userResponse)) {
                    await bot.sendMessage(senderId, {
                        document: { url: downloadUrl },
                        mimetype: "video/mp4",
                        fileName: `${video.title}.mp4`,
                        caption: `✅ *Download complete!*\n🎬 *Title:* ${video.title}`
                    }, { quoted: receivedMsg });
                } else {
                    await bot.sendMessage(senderId, {
                        video: { url: downloadUrl },
                        caption: `✅ *Download complete!*\n🎬 *Title:* ${video.title}`
                    }, { quoted: receivedMsg });
                }
            }
        });

    } catch (error) {
        console.error(error);
        reply("⚠️ Error processing request.");
    }
});

module.exports = { downloadYouTube };
