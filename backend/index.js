import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/generate", async (req, res) => {
    const { prompt, aspectRatio } = req.body;

    const sizeMap = {
        "1:1": "1024x1024",     // Square
        "3:2": "1024x1024",     // Standard
        "16:9": "1792x1024",    // Wide
        "4:5": "1024x1792",     // Portrait
        "2:3": "1024x1792"      // Portrait
    };

    // Get the size based on the aspect ratio
    const size = sizeMap[aspectRatio] || "1024x1024";  // Default to "1024x1024" if no match

    // Debugging: Log the selected size
    console.log(`Selected size: ${size} for aspect ratio: ${aspectRatio}`);

    try {
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is missing" });
        }
        console.log("Generating image with prompt:", prompt, "and size:", size);

        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                prompt,
                size,
                n: 1,
                response_format: "url"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        // Check the response
        console.log('OpenAI API response:', response.data);

        const imageUrl = response?.data?.data?.[0]?.url;
        if (!imageUrl) {
            return res.status(500).json({ error: "Image generation failed" });
        }

        res.json({ imageUrl });

    } catch (error) {
        console.error("Error generating image:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate image" });
    }
});


app.post("/download", async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

        res.setHeader("Content-Disposition", "attachment; filename=generated-image.png");
        res.setHeader("Content-Type", "image/png");
        res.send(response.data);
    } catch (error) {
        console.error("Error downloading image:", error.message);
        res.status(500).json({ error: "Failed to download image" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});