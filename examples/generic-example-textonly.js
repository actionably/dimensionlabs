/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict';

if (!process.env.DIMENSIONLABS_API_KEY_GENERIC) {
  throw new Error('"DIMENSIONLABS_API_KEY_GENERIC" environment variable must be defined');
}

const dimensionLabs = require('../src/dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_GENERIC,
  {debug:true, urlRoot: process.env.DIMENSIONLABS_URL_ROOT}).generic

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  dimensionLabs.logOutgoing(
    dimensionLabs.messageUtil.messageWithText('USERIDHERE111', question)
  );

  rl.question(question, function(answer) {
    dimensionLabs.logIncoming(
      dimensionLabs.messageUtil.messageWithText('USERIDHERE111', answer)
    )
    if (answer === 'quit') {
      rl.close();
      return;
    }
    ask('You are right when you say: ' + answer + '. What else? ');
  });
}

ask('Tell me your thoughts: ');
