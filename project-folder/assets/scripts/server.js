require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const apiKey = process.env.API_KEY;

app.use(express.json());

// Default route to handle root URL
app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.post('/get-ai-response', async (req, res) => {
    const userInput = req.body.userInput;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        prompt: userInput,
        model: 'text-davinci-003',
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.7
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', data, { headers });

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            res.json({ response: response.data.choices[0].text.trim() });
        } else {
            throw new Error('AI response is empty');
        }
    } catch (error) {
        console.error('Error getting AI response:', error);
        res.status(500).json({ error: 'Sorry, I could not process your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
