const express = require('express');
const axios = require('axios');
const router = express.Router();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

let lastTranscripts = {
  'firstSpeaker': 2,
  'conversations': ['Thank you for calling me mobile My name is there.', 'Hi good morning. One I wanted to ask about your dreams of phones and which phone you would recommend for the. Team.', 'I think the i Phones are very popular there\'s a range of them so you can get a more luxury type i Phone which is like the i Phone. Eleven. Really big screen so you can watch all the movies. And it\'s really nice interface for. Data Usage if you don\'t like apple you can go for. Galaxy as ten plus another great phone was there any phone you had in mind.', 'Thank you good bye.'],
};

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
