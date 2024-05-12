const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { apiKey } = require('./config.js');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:1212' })); // Replace with the correct origin

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const OPENAI_API_KEY = apiKey;

const testFn = async () => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'how are you doing?' }],
    }),
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('check response:- ', response.data.choices[0].message);
};

// testFn();

app.get('/api/test', async (req, res) => {
  res.send('Good!');
});

app.post('/api/chat', async (req, res) => {
  console.log('I reached here');
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('check response:- ', response);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error with OpenAI API request');
  }
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
