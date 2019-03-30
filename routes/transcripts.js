const express = require('express');
const axios = require('axios');
const router = express.Router();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

let lastTranscripts = null;

router.post('/', (req, res, next) => {
  const { results } = JSON.parse(req.body.AddOns);
  const { content_type, url } = results.voicebase_transcription.payload[0];
  axios.get(url, {
    headers: {
      'Content-Type': content_type,
    },
    auth: {
      username: accountSid,
      password: authToken,
    },
  })
    .then(response => {
      const { text } = response.data.media.transcripts;
      const firstSpeaker = text.startsWith('Speaker 1: ') ? 1 : 2;
      const conversations = text.split(/\s*Speaker \d: /).slice(1);
      lastTranscripts = { firstSpeaker, conversations };
    })
    .then(() => client.messages.create({
      body: 'Thank you for contacting our T-Mobile representative. Please take time to rate your experience: https://jasonpark.me/T-Support/#/survey',
      from: '+13232714615',
      to: '+14703341764',
    }).then(message => message.sid))
    .then(() => res.json({ success: true }))
    .catch(next);
});

router.get('/', (req, res) => res.json({ transcripts: lastTranscripts }));

module.exports = router;
