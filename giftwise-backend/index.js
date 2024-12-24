const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

app.get('/api/recommendations', async (req, res) => {
  const { preferences } = req.body; // Ambil preferensi dari body request

  if (!preferences || preferences.length === 0) {
    return res.status(400).json({ error: "Preferences are required" });
  }
  
  try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = `berikan 5 rekomendasi kado yang sesuai dengan preferensi berikut: ${preferences.join(", ")} dalam range harga 70-80 ribu rupiah`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
    
        res.json({ recommendations: text });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});