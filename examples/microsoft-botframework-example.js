/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
if (!process.env.DIMENSIONLABS_API_KEY_MICROSOFT) {
  throw new Error('"DIMENSIONLABS_API_KEY_MICROSOFT" environment variable must be defined');
}

const express = require('express');
const bodyParser = require('body-parser');

const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');

// Create server
const app = express();
app.use(bodyParser.json());

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// create dimensionLabs object with api key.
const dimensionLabs = require('../src/dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_MICROSOFT,
  {debug:true, urlRoot: process.env.DIMENSIONLABS_URL_ROOT}).microsoft
// add dimensionLabs middleware
adapter.use(dimensionLabs.middleware())


// Add conversation state middleware
const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

// Listen for incoming requests
const webHookPath = '/api/messages';
app.post(webHookPath, (req, res) => {
  // Route received request to adapter for processing
  adapter.processActivity(req, res, (context) => {
    if (context.activity.type === 'message') {
      const state = conversationState.get(context);
      const count = state.count === undefined ? state.count = 0 : ++state.count;
      const p = context.sendActivity(`${count}: You said "${context.activity.text}"`);
      return p.then((data) => {
        console.log(data);
        return data;
      })
    } else {
      return context.sendActivity(`[${context.activity.type} event detected]`);
    }
  });
});

var port = process.env.port || process.env.PORT || 3978;
app.listen(port);
console.log('microsoft webhook available at http://localhost:' + port + webHookPath);
