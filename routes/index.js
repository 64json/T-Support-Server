const express = require('express');
const https = require('https');
const request = require('request');
const router = express.Router();
const fs = require('fs');

const accountSid = 'AC588ff8e1d9590077e36a6193dd5be976';
const authToken = 'c7f64bec8c19d9578c12b479ffa59f3f';
const client = require('twilio')(accountSid, authToken);

let transcript = '';

router.post('/transcript', (req, res, next) => {
  console.log(req.body);
  const { request_sid } = req.body.results.voicebase_transcription;
  console.log(request_sid);
  client.transcriptions(request_sid)
    .fetch()
    .then(transcription => console.log(transcription));
});

router.get('/transcript', (req, res) => res.json({ transcript }));

module.exports = router;
