const express = require('express');
const cors = require('cors');
const yts = require('yt-search'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: "online", message: "NEXUSz Music API funcionando 🚀" });
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Falta el parámetro 'q'" });

    try {
        const results = await yts(query);
        const videos = results.videos.slice(0, 10);

        const tracks = videos.map(video => {
            const timeParts = video.duration.timestamp.split(':').map(Number);
            let durationSeconds = 0;
            if (timeParts.length === 2) durationSeconds = (timeParts[0] * 60) + timeParts[1];

            // Usamos una API de conversión externa para transformar el video en audio MP3 directo para Roblox
            const streamUrl = `https://convert.b64.to/api/download?url=${encodeURIComponent(video.url)}&format=mp3`;

            return {
                name: video.title,
                artist: video.author.name || "Artista",
                preview_url: streamUrl, 
                duration: durationSeconds,
                cover_image: video.thumbnail || "rbxassetid://10842010178"
            };
        });

        res.json({ success: true, tracks: tracks });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error interno" });
    }
});

app.listen(PORT);
