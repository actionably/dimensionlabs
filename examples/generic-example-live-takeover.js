/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict';

if (!process.env.DIMENSIONLABS_API_KEY_GENERIC) {
  throw new Error('"DIMENSIONLABS_API_KEY_GENERIC" environment variable must be defined');
}

const dimensionLabs = require('../src/dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_GENERIC,
  {debug:false, urlRoot: process.env.DIMENSIONLABS_URL_ROOT}).generic

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {

  dimensionLabs.logIncoming(
    dimensionLabs.messageUtil.messageWithText('Joe', question)
  );

  rl.question(question, function(answer) {
    dimensionLabs.logOutgoing(
      dimensionLabs.messageUtil.messageWithText('Joe', answer)
    )
    if (answer === 'quit') {
      rl.close();
      return;
    }
    ask('You are right when you say: ' + answer + '. What else? ');
  });
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.post('/sendMessage', function(req, res) {
  const text = req.body.text;
  console.log(text)
  res.send('worked');
});
var port = 4000;
app.listen(port);

ask('Tell me your thoughts: ');

