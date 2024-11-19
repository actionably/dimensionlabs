/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict';

require('es6-promise').polyfill()

var DimensionLabsFacebook = require('./dimensionlabs-facebook')
var DimensionLabsSlack = require('./dimensionlabs-slack')
var DimensionLabsKik = require('./dimensionlabs-kik')
var DimensionLabsMicrosoftDeprecated = require('./dimensionlabs-microsoft-deprecated')
var DimensionLabsMicrosoft = require('./dimensionlabs-microsoft')
var DimensionLabsGoogle = require('./dimensionlabs-google')
var DimensionLabsAmazonAlexa = require('./dimensionlabs-amazon-alexa')
var DimensionLabsGeneric = require('./dimensionlabs-generic')
var DimensionLabsLine = require('./dimensionlabs-line')


module.exports = function(apiKey, config) {
  apiKey = process.env.DIMENSIONLABS_API_KEY_OVERRIDE || apiKey;
  if (!apiKey) {
    throw new Error('YOU MUST SUPPLY AN API_KEY TO DIMENSIONLABS!');
  }
  var serverRoot = process.env.DIMENSIONLABS_SERVER_ROOT || 'https://tracker.dimensionlabs.io';
  var urlRoot = serverRoot + '/track';
  var debug = process.env.DIMENSIONLABS_DEBUG === 'true' || false;
  var printErrors = true;
  if (config) {
    debug = config.debug || debug;
    serverRoot = config.serverRoot || serverRoot;
    urlRoot = config.urlRoot || serverRoot + '/track';
    if (config.printErrors !== undefined) {
      printErrors = config.printErrors;
    }
  } else {
    config = {}
  }

  return {
    facebook: new DimensionLabsFacebook(apiKey, urlRoot, debug, printErrors, config),
    slack: new DimensionLabsSlack(apiKey, urlRoot, debug, printErrors, config),
    kik: new DimensionLabsKik(apiKey, urlRoot, debug, printErrors, config),
    microsoftDeprecated: new DimensionLabsMicrosoftDeprecated(apiKey, urlRoot, debug, printErrors, config),
    microsoft: new DimensionLabsMicrosoft(apiKey, urlRoot, debug, printErrors, config),
    google: new DimensionLabsGoogle(apiKey, urlRoot, debug, printErrors, config),
    alexa: new DimensionLabsAmazonAlexa(apiKey, urlRoot, debug, printErrors, config),
    line: new DimensionLabsLine(apiKey, urlRoot, debug, printErrors, config),
    generic: new DimensionLabsGeneric('generic', apiKey, urlRoot, debug, printErrors, config),
    universal: new DimensionLabsGeneric('universal', apiKey, urlRoot, debug, printErrors, config),
    webchat: new DimensionLabsGeneric('webchat', apiKey, urlRoot, debug, printErrors, config),
    botcopy: new DimensionLabsGeneric('botcopy', apiKey, urlRoot, debug, printErrors, config),
    twitter: new DimensionLabsGeneric('twitter', apiKey, urlRoot, debug, printErrors, config),
    recast: new DimensionLabsGeneric('recast', apiKey, urlRoot, debug, printErrors, config),
    sms: new DimensionLabsGeneric('sms', apiKey, urlRoot, debug, printErrors, config),
    skype: new DimensionLabsGeneric('skype', apiKey, urlRoot, debug, printErrors, config),
    viber: new DimensionLabsGeneric('viber', apiKey, urlRoot, debug, printErrors, config),
    wechat: new DimensionLabsGeneric('wechat', apiKey, urlRoot, debug, printErrors, config)
  };
};
