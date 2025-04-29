const axios = require('axios');

// Wit.ai API endpoint
const WIT_AI_URL = 'https://api.wit.ai/message';
const WIT_AI_SERVER_TOKEN = process.env.WIT_AI_SERVER_TOKEN;

module.exports = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        console.error('Error: Query is required');
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        console.log(`Sending request to Wit.ai with query: ${query}`);
        const response = await axios.get(WIT_AI_URL, {
            params: {
                v: '20250428',
                q: query,
            },
            headers: {
                Authorization: `Bearer ${WIT_AI_SERVER_TOKEN}`,
            },
        });

        console.log('Response from Wit.ai:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error calling Wit.ai API:', error.message);
        res.status(500).json({ error: 'Failed to process request' });
    }
};
