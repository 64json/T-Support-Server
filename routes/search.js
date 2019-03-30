const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
  const { q } = req.query;
  axios.get(`https://support.t-mobile.com/api/core/v3/search/contents?sort=relevanceDesc&count=1&filter=search(${encodeURIComponent(q)}})&fields=resources.html,subject,highlightBody,highlightSubject`)
    .then(response => {
      res.json(JSON.parse(response.data.replace('throw \'allowIllegalResourceCall is false.\';', '')));
    });
});

module.exports = router;
