const express = require('express');
const https = require('https');
const request = require('request');
const router = express.Router();
const fs = require('fs');

let transcript = '';

router.post('/transcript', (req, res, next) => {
  console.log(req.body);
});

router.get('/transcript', (req, res) => res.json({ transcript }));

module.exports = router;
