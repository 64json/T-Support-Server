const express = require('express');
const https = require('https');
const router = express.Router();

let question = '';
let solution = '';
let wavurl = '';

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

router.post('/savetext', function (request, response) {
  console.log('POST /savetext');

  // Save request.body
  console.log(request.body);
  question = request.body.text;

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end('thanks');
});

router.post('/saveans', function (request, response) {
  console.log('POST /saveans');

  // Save request.body
  console.log(request.body);
  wavurl = request.body.url + '.mp3';
  download(wavurl, 'tmp.wav', read);


  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end('thanks');
});

let read = () => {
  let options = {
    headers: { 'content-type': 'audio/mp3' },
    url: 'https://gateway-wdc.watsonplatform.net/speech-to-text/api/v1/recognize',
    body: fs.createReadStream('tmp.wav'),
    encoding: null,
    auth: {
      'user': 'apikey',
      'pass': 'Wk54vkGwPI8FlZAckH9j9KbNDtJ1dMwdqekaPk5_HxK_',
    },
  };
  request.post(options, (error, response, body) => {
    solution = '';
    if (error) {
      console.log('Error: ', error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
    console.log('JSON Response\n');
    console.log(jsonResponse);
    let tmp = JSON.parse(body).results;
    for (let i = 0; i < tmp.length; ++i) {
      solution += tmp[i].alternatives[0].transcript;
    }

    console.log(question, solution);
  });

};

router.get('/get', function (request, response) {
  response.end('{"question": ' + question + ', ' + '"solution": ' + solution + '}');
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
