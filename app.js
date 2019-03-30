const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const ratesRouter = require('./routes/rates');
const searchRouter = require('./routes/search');
const transcriptsRouter = require('./routes/transcripts');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/rates', ratesRouter);
app.use('/search', searchRouter);
app.use('/transcripts', transcriptsRouter);

module.exports = app;
