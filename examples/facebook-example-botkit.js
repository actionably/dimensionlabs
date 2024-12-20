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

var dimensionLabs = require('../src/dimensionlabs')(process.env.DIMENSIONLABS_API_KEY_FACEBOOK,
  {urlRoot: process.env.DIMENSIONLABS_URL_ROOT, debug:true}).facebook;


var port = 4000;
var webHookPath = '/facebook/receive/';

var Botkit = require('botkit');
var controller = Botkit.facebookbot({
  access_token: process.env.FACEBOOK_PAGE_TOKEN,
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN
});

var bot = controller.spawn({
});

controller.middleware.receive.use(dimensionLabs.receive);
controller.middleware.send.use(dimensionLabs.send);


// if you are already using Express, you can use your own server instance...
// see "Use BotKit with an Express web server"
controller.setupWebserver(port,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver, bot, function() {
    console.log('Facebook webhook available at http://localhost:' + port + webHookPath);
  });
});

controller.on('facebook_optin', function(bot, message) {

  bot.reply(message, 'Welcome to my app!');

});

controller.on('message_received', function(bot, message) {
  bot.reply(message,  'You are right when you say '+message.text);
});
