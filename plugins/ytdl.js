const { cmd } = require('../command');
const yts = require('yt-search');
const { fetchJson } = require("../lib/functions");
const axios = require("axios");

// YouTube MP4 Downloader Function
async function downloadYouTubeVideo(url, quality) {
    try {
        if (!url || !quality) throw new Error("URL and quality parameters are required");
        
        const response = await axios.get("https://ab.cococococ.com/ajax/download.php", {
            params: {
                button: 1,
                start: 1,
                end: 1,
                format: parseInt(quality.replace('p', ''), 10),
                url: url
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://loader.to/'
            }
        });

        const processId = response.data.id;
        return await checkDownloadProgress(processId);
    } catch (error) {
        console.error("YouTube Download Error:", error);
        throw new Error("Failed to process video download");
    }
}

async function checkDownloadProgress(processId) {
    try {
        const response = await axios.get("https://p.oceansaver.in/ajax/progress.php", {
            params: { id: processId }
        });

        const { progress, download_url, text } = response.data;
        return text === 'Finished' ? download_url : new Promise(resolve => 
            setTimeout(() => resolve(checkDownloadProgress(processId)), 1000)
        );
    } catch (error) {
        throw new Error("Progress check failed: " + error.message);
    }
}

// YouTube ID Extractor
function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Command: Song Downloader
cmd({
    pattern: 'song',
    alias: ["play", "music"],
    desc: "Download YouTube audio",
    react: '🎵',
    category: 'download',
    filename: __filename
}, async (conn, msg, data) => {
    try {
        const { from, q, reply } = data;
        if (!q) return reply("Please provide a YouTube URL or song name");

        // Search YouTube
        const searchResults = await yts(q);
        if (!searchResults.videos.length) return reply("No results found");
        const videoInfo = searchResults.videos[0];

        // Send selection menu
        const menu = `
🎵 *MUSIC DOWNLOADER* 🎵
────────────────
• Title: ${videoInfo.title}
• Duration: ${videoInfo.timestamp}
• Views: ${videoInfo.views}
• Uploaded: ${videoInfo.ago}
────────────────
Reply with:
1 - Audio File (MP3)
2 - Document File (MP3)
        `.trim();

        const sentMsg = await conn.sendMessage(from, {
            image: { url: videoInfo.thumbnail },
            caption: menu
        }, { quoted: msg });

        // Handle user response
        const handler = async (response) => {
            const content = response.message?.conversation || 
                          response.message?.extendedTextMessage?.text;
            
            if (response.key.remoteJid === from && 
                response.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id) {
                
                conn.ev.off('messages.upsert', handler);

                try {
                    const downloadLink = (await fetchJson(
                        `https://www.dark-yasiya-api.site/download/ytmp3?url=${videoInfo.url}`
                    )).result.dl_link;

                    if (content === '1') {
                        await conn.sendMessage(from, {
                            audio: { url: downloadLink },
                            mimetype: 'audio/mpeg'
                        }, { quoted: response });
                    } else if (content === '2') {
                        await conn.sendMessage(from, {
                            document: { url: downloadLink },
                            mimetype: 'audio/mpeg',
                            fileName: `${videoInfo.title.replace(/[^\w\s]/gi, '')}.mp3`,
                            caption: "Here's your audio file"
                        }, { quoted: response });
                    }
                } catch (error) {
                    console.error("Download Error:", error);
                    reply("Failed to download the audio");
                }
            }
        };

        conn.ev.on('messages.upsert', handler);
    } catch (error) {
        console.error("Song Command Error:", error);
        reply("An error occurred while processing your request");
    }
});

// Command: Video Downloader
cmd({
    pattern: "video",
    desc: "Download YouTube videos",
    react: '🎥',
    category: "download",
    filename: __filename
}, async (conn, msg, data) => {
    try {
        const { from, q, reply } = data;
        if (!q) return reply("Please provide a YouTube URL or video name");

        const videoID = extractYouTubeID(q);
        const videoUrl = videoID ? `https://www.youtube.com/watch?v=${videoID}` : q;

        // Search YouTube
        const searchResults = await yts(videoUrl);
        if (!searchResults.videos.length) return reply("No results found");
        const videoInfo = searchResults.videos[0];

        // Video quality options
        const menu = `
🎥 *VIDEO DOWNLOADER* 🎥
────────────────
• Title: ${videoInfo.title}
• Duration: ${videoInfo.timestamp}
• Views: ${videoInfo.views}
• Uploaded: ${videoInfo.ago}
────────────────
Reply with:
1 - 360p Video
2 - 480p Video
3 - 720p Video
4 - 1080p Video
5 - Document Format (MP4)
        `.trim();

        const sentMsg = await conn.sendMessage(from, {
            image: { url: videoInfo.thumbnail },
            caption: menu
        }, { quoted: msg });

        // Handle user response
        const handler = async (response) => {
            const content = response.message?.conversation || 
                          response.message?.extendedTextMessage?.text;
            
            if (response.key.remoteJid === from && 
                response.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id) {
                
                conn.ev.off('messages.upsert', handler);

                try {
                    const qualityMap = {
                        '1': '360p',
                        '2': '480p',
                        '3': '720p',
                        '4': '1080p'
                    };

                    if (content === '5') {
                        const downloadUrl = await downloadYouTubeVideo(videoInfo.url, '360p');
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl },
                            mimetype: 'video/mp4',
                            fileName: `${videoInfo.title.replace(/[^\w\s]/gi, '')}.mp4`,
                            caption: "Here's your video file"
                        }, { quoted: response });
                    } else if (qualityMap[content]) {
                        const downloadUrl = await downloadYouTubeVideo(videoInfo.url, qualityMap[content]);
                        await conn.sendMessage(from, {
                            video: { url: downloadUrl },
                            caption: "Here's your video"
                        }, { quoted: response });
                    }
                } catch (error) {
                    console.error("Video Download Error:", error);
                    reply("Failed to download the video");
                }
            }
        };

        conn.ev.on('messages.upsert', handler);
    } catch (error) {
        console.error("Video Command Error:", error);
        reply("An error occurred while processing your request");
    }
});
