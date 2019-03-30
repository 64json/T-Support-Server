const express = require('express');
const https = require('https');
const request = require('request');
const router = express.Router();
const fs = require('fs');

let question = '';
let solution = '';

let download = function (url, dest, cb) {
  let file = fs.createWriteStream(dest);
  https.get(url, response => {
    response.pipe(file);
    file.on('finish', function () {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

router.post('/question', (req, res) => {
  question = req.body.text;

  res.json({ success: true });
});

router.post('/answer', (req, res, next) => {
  const { url } = req.body;
  download(`${url}.mp3`, 'answer.wav', () => {
    request.post({
      headers: { 'content-type': 'audio/mp3' },
      url: 'https://gateway-wdc.watsonplatform.net/speech-to-text/api/v1/recognize',
      body: fs.createReadStream('answer.wav'),
      encoding: null,
      auth: {
        'user': 'apikey',
        'pass': 'Wk54vkGwPI8FlZAckH9j9KbNDtJ1dMwdqekaPk5_HxK_',
      },
    }, (error, response, body) => {
      solution = '';
      if (error) return next(error);
      let { results } = JSON.parse(body);
      for (const result of results) {
        solution += result.alternatives[0].transcript;
      }

      res.json({ success: true });
    });

  });
});

router.get('/get', (req, res) => res.json({ question, solution }));

module.exports = router;
