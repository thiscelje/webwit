const axios = require('axios');

// Wit.ai API endpoint
const WIT_AI_URL = 'https://api.wit.ai/message';
const WIT_AI_SERVER_TOKEN = '5KBEPBHH7N3GN5YR3SSXR47BAYQSTSKF';

module.exports = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const response = await axios.get(WIT_AI_URL, {
            params: {
                v: '20250428',
                q: query,
            },
            headers: {
                Authorization: `Bearer ${WIT_AI_SERVER_TOKEN}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error calling Wit.ai API:', error.message);
        res.status(500).json({ error: 'Failed to process request' });
    }
};