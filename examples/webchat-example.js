/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
"use strict";

if (!process.env.DIMENSIONLABS_API_KEY_GENERIC) {
  throw new Error(
    '"DIMENSIONLABS_API_KEY_GENERIC" environment variable must be defined'
  );
}

const dimensionLabs = require("../src/dimensionlabs")(process.env.DIMENSIONLABS_API_KEY_GENERIC, {
  debug: true,
  urlRoot: process.env.DIMENSIONLABS_URL_ROOT
}).webchat;

var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  const message = {
    text: question,
    userId: "USERIDHERE123123",
    platformUserJson: {
      first_name: "Bob",
      last_name: "Loblaw",
      gender: "male",
      locale: "en_US"
    },
    platformJson: {
      whateverJson: "any JSON specific to your platform can be stored here"
    }
  };
  dimensionLabs.logOutgoing(message);

  rl.question(question, function(answer) {
    const message = {
      text: answer,
      userId: "USERIDHERE123123",
      platformUserJson: {
        first_name: "Bob",
        last_name: "Loblaw",
        gender: "male",
        locale: "en_US"
      },
      platformJson: {
        whateverJson: "any JSON specific to your platform can be stored here"
      }
    };
    dimensionLabs.logIncoming(message);
    if (answer === "quit") {
      rl.close();
      return;
    }
    ask("You are right when you say: " + answer + ". What else? ");
  });
}

ask("Tell me your thoughts: ");
