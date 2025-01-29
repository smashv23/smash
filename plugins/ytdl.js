// Filename: youtube_downloader.js

const { cmd, commands } = require('../command');
const yts = require('yt-search');
const { fetchJson } = require("../lib/functions");
const axios = require("axios");

/**
 * Downloads a YouTube video as MP4
 * @param {string} url - The YouTube video URL
 * @param {string} format - Video quality (e.g., "360p", "720p")
 * @returns {Promise<string>} - Direct download link
 */
async function downloadYouTubeVideo(url, format) {
    try {
        if (!url || !format) {
            throw new Error("URL and format parameters are required.");
        }

        const videoQuality = parseInt(format.replace('p', ''), 10);
        const params = {
            button: 1,
            start: 1,
            end: 1,
            format: videoQuality,
            url: url
        };

        const headers = {
            'Accept': "*/*",
            'User-Agent': "Mozilla/5.0 (Linux; Android 10) Chrome/124.0.0.0 Mobile Safari/537.36"
        };

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

                const { progress, download_url, text } = progressResponse.data;
                return text === 'Finished' ? download_url : (await new Promise(res => setTimeout(res, 1000)), checkProgress());
            } catch (error) {
                throw new Error("Error checking progress: " + error.message);
            }
        }

        return await checkProgress();
    } catch (error) {
        console.error("Error:", error);
        return { error: error.message };
    }
}

/**
 * Extracts YouTube video ID from a URL
 * @param {string} url - YouTube video URL
 * @returns {string|null} - Extracted video ID
 */
function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Converts a YouTube URL to a standard format
 * @param {string} url - YouTube URL
 * @returns {string} - Standardized URL
 */
function convertYouTubeLink(url) {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
}

/**
 * Command to download a YouTube song
 */
cmd({
    pattern: 'song',
    alias: "play",
    desc: "Download songs from YouTube",
    react: '🎵',
    category: 'download',
    filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a YouTube URL or title.");

        const searchResults = await yts(convertYouTubeLink(q));
        const video = searchResults.videos[0];
        if (!video) return reply("No video found.");

        const downloadLink = await fetchJson(`https://www.dark-yasiya-api.site/download/ytmp3?url=${video.url}`);
        await bot.sendMessage(from, { audio: { url: downloadLink.result.dl_link }, mimetype: "audio/mpeg" }, { quoted: message });
    } catch (error) {
        console.error(error);
        reply("Error processing request.");
    }
});

/**
 * Command to download a YouTube video
 */
cmd({
    pattern: "video",
    desc: "Download YouTube videos",
    react: '🎥',
    category: "download",
    filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a YouTube URL or title.");

        const searchResults = await yts(convertYouTubeLink(q));
        const video = searchResults.videos[0];
        if (!video) return reply("No video found.");

        const downloadLink = await downloadYouTubeVideo(video.url, "720p");
        if (!downloadLink) return reply("Download failed.");

        await bot.sendMessage(from, { video: { url: downloadLink }, caption: "Here is your video." }, { quoted: message });
    } catch (error) {
        console.error(error);
        reply("Error processing request.");
    }
});

/**
 * Command to download YouTube audio
 */
cmd({
    pattern: "yta",
    alias: "ytmp3",
    react: '⬇️',
    dontAddCommandList: true,
    filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
    try {
        if (!q) return reply("*Need a YouTube URL!*");

        const audioData = await fetchJson(`https://www.dark-yasiya-api.site/download/ytmp3?url=${q}`);
        const downloadUrl = audioData.result.dl_link;

        await bot.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: message });
    } catch (error) {
        console.error("Error:", error);
        reply("*Failed to process request. Please try again later!*");
    }
});

module.exports = { downloadYouTubeVideo };
