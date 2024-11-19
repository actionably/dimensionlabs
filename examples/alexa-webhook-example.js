/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict';

if (!process.env.DIMENSIONLABS_API_KEY_ALEXA) {
  throw new Error('"DIMENSIONLABS_API_KEY_ALEXA" environment variable must be defined');
}

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dimensionLabs = require('../src/dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_ALEXA, {
  debug: true,
  urlRoot: process.env.DIMENSIONLABS_URL_ROOT
}).alexa;

const app = express();
app.use(bodyParser.json());

var webHookPath = '/alexa';
app.get(webHookPath, function(req, res) {
  res.send('Hello from the alexa webhook');
});

app.post(webHookPath, function(req, res) {
  dimensionLabs.logIncoming(req.body);

  const responseBody = {
    'version': '1.0',
    'response': {
      'outputSpeech': {
        'type': 'PlainText',
        'text': 'Hello World!'
      },
      'card': {
        'content': 'Hello World!',
        'title': 'Hello World',
        'type': 'Simple'
      },
      'shouldEndSession': true
    },
    'sessionAttributes': {}
  };


  dimensionLabs.logOutgoing(req.body, responseBody)

  res.send(responseBody);

});

var port = 4000;
app.listen(port);
console.log('Amazon Alexa webhook available at http://localhost:' + port + webHookPath);
