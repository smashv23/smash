// Filename: youtube_downloader.js

const { cmd } = require('../command');
const yts = require('yt-search');
const { fetchJson } = require("../lib/functions");
const axios = require("axios");

/**
 * Fetch YouTube MP3 Download Link
 * @param {string} url - The YouTube video URL.
 * @returns {Promise<string>} - Direct MP3 download link.
 */
async function downloadYouTubeMP3(url) {
    try {
        const response = await fetchJson(`https://www.dark-yasiya-api.site/download/ytmp3?url=${url}`);

        if (!response || !response.result || !response.result.dl_link) {
            throw new Error("Failed to get MP3 link.");
        }

        return response.result.dl_link;
    } catch (error) {
        console.error("MP3 Download Error:", error);
        return null;
    }
}

/**
 * Fetch YouTube Video Download Link
 * @param {string} url - The YouTube video URL.
 * @param {string} format - Video quality (e.g., "360p", "720p").
 * @returns {Promise<string>} - Direct MP4 download link.
 */
async function downloadYouTubeMP4(url, format) {
    try {
        if (!url || !format) throw new Error("URL and format are required.");

        const quality = parseInt(format.replace('p', ''), 10);
        const params = { button: 1, start: 1, end: 1, format: quality, url };
        const headers = { 'User-Agent': "Mozilla/5.0 (Linux; Android 10) Chrome/124.0.0.0" };

        const response = await axios.get("https://ab.cococococ.com/ajax/download.php", { params, headers });
        if (!response.data.id) throw new Error("Invalid response from server.");

        const videoId = response.data.id;

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
        console.error("MP4 Download Error:", error);
        return null;
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
 * 🎵 Download YouTube Audio (MP3)
 */
cmd({
    pattern: 'song',
    alias: "play",
    desc: "🎧 Download songs from YouTube",
    react: '🎼',
    category: 'download',
    filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a YouTube URL or title.");

        const searchResults = await yts(normalizeYouTubeLink(q));
        const video = searchResults.videos[0];
        if (!video) return reply("⚠️ No video found.");

        reply("⏳ Downloading audio...");

        const mp3Link = await downloadYouTubeMP3(video.url);
        if (!mp3Link) return reply("❌ Failed to download audio.");

        await bot.sendMessage(from, {
            audio: { url: mp3Link },
            mimetype: "audio/mpeg",
            fileName: `${video.title}.mp3`
        }, { quoted: message });

        reply("✅ Audio sent successfully!");
    } catch (error) {
        console.error(error);
        reply("⚠️ Error processing request.");
    }
});

/**
 * 🎥 Download YouTube Video (MP4)
 */
cmd({
    pattern: "video",
    desc: "📽️ Download YouTube videos",
    react: '🎞️',
    category: "download",
    filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a YouTube URL or title.");

        const searchResults = await yts(normalizeYouTubeLink(q));
        const video = searchResults.videos[0];
        if (!video) return reply("⚠️ No video found.");

        reply("⏳ Downloading video...");

        const mp4Link = await downloadYouTubeMP4(video.url, "720p");
        if (!mp4Link) return reply("❌ Failed to download video.");

        await bot.sendMessage(from, {
            video: { url: mp4Link },
            caption: `✅ *Download complete!*\n🎬 *Title:* ${video.title}`
        }, { quoted: message });

        reply("✅ Video sent successfully!");
    } catch (error) {
        console.error(error);
        reply("⚠️ Error processing request.");
    }
});

module.exports = { downloadYouTubeMP3, downloadYouTubeMP4 };
