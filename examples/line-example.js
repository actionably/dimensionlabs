/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict';

if (!process.env.DIMENSIONLABS_API_KEY_LINE) {
  throw new Error('"DIMENSIONLABS_API_KEY_LINE" environment variable must be defined');
}
if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
  throw new Error('"LINE_CHANNEL_ACCESS_TOKEN" environment variable must be defined');
}
if (!process.env.LINE_CHANNEL_SECRET) {
  throw new Error('"LINE_CHANNEL_SECRET" environment variable must be defined');
}

var express = require('express');
var line = require('@line/bot-sdk');

const dimensionLabs = require('../src/dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_LINE,
  { debug:true }).line;

const app = express();
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};
const client = new line.Client(config);

app.use('/webhook', line.middleware(config), (req, res) => {
  req.body.events.map(event => {
    dimensionLabs.logIncoming(event);
    if (event.type === 'message' && event.message.type === 'text') {
      var reply = {
        type: 'text',
        text: event.message.text
      };
      return client.replyMessage(event.replyToken, reply)
        .then(() => dimensionLabs.logOutgoing(event.source, reply))
        .catch(err => console.log(err));
    }
  });
  res.send('OK');
});

app.listen(process.env.PORT | 3000, () => console.log(`Bot listen in port ${process.env.PORT | 3000}`));
