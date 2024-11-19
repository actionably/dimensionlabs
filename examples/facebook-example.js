/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict';

if (!process.env.DIMENSIONLABS_API_KEY_FACEBOOK) {
  throw new Error('"DIMENSIONLABS_API_KEY_FACEBOOK" environment variable must be defined');
}
if (!process.env.FACEBOOK_VERIFY_TOKEN) {
  throw new Error('"FACEBOOK_VERIFY_TOKEN" environment variable must be defined');
}
if (!process.env.FACEBOOK_PAGE_TOKEN) {
  throw new Error('"FACEBOOK_PAGE_TOKEN" environment variable must be defined');
}

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');
const dimensionLabs = require('../src/dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_FACEBOOK,
  {debug:true, urlRoot: process.env.DIMENSIONLABS_URL_ROOT, redact: process.env.DIMENSIONLABS_REDACT}).facebook
const dimensionLabsEventUtil = dimensionLabs.eventUtil

const app = express();
app.use(bodyParser.json());

var webHookPath = '/webhook';
app.get(webHookPath, function(req, res) {
  if (req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
    return;
  }
  res.send('Error, wrong validation token');
});

app.post(webHookPath, function(req, res) {
  const functionTiming = {
    start: new Date().getTime(),
    end: null,
    difference: null
  }

  dimensionLabs.logIncoming(req.body);

  const messagingEvents = req.body.entry[0].messaging;
  if (messagingEvents && messagingEvents.length && messagingEvents[0].message && messagingEvents[0].message.text) {
    const event = req.body.entry[0].messaging[0];
    const sender = event.sender.id;
    const text = event.message.text;
    if (event.message.is_echo) {
      res.sendStatus(200);
      return;
    }
    const requestData = {
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: process.env.FACEBOOK_PAGE_TOKEN},
      method: 'POST',
      json: {
        dashbotTemplateId: 'right',
        recipient: {id: sender},
        message: {
          text: 'You are right when you say: ' + text
        }
      }
    };
    fetch(requestData.url + '?access_token=' + requestData.qs.access_token, {
      method: requestData.method,
      body: JSON.stringify(requestData.json),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      if(response.ok) {
        res.sendStatus(200);
        response.json().then(function(responseJson) {
          dimensionLabs.logOutgoing(requestData, responseJson);
        })
        functionTiming.end = new Date().getTime();
        functionTiming.difference = functionTiming.end - functionTiming.start;
        dimensionLabs.logEvent(dimensionLabsEventUtil.createCustomEvent('functionTiming', sender, sender, functionTiming))
      }
    });
  } else {
    res.sendStatus(200);
    return;
  }

});

var port = 4000;
app.listen(port);
console.log('Facebook webhook available at http://localhost:' + port + webHookPath);
