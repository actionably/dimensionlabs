/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict'

var _ = require('lodash');
var makeRequest = require('./make-request')

var VERSION = require('../package.json').version;

function DimensionlabsMicrosoftDeprecated(apiKeyMap, urlRoot, debug, printErrors, config) {
  var that = this;
  that.apiKeyMap = apiKeyMap;
  that.urlRoot = urlRoot;
  that.debug = debug;
  that.printErrors = printErrors;
  that.facebookToken = null;
  that.config = config;

  // facebook token hack
  that.setFacebookToken = function(token){
    that.facebookToken = token;
  }

  // middleware endpoints
  that.receive = function(session, next) {
    logDimensionLabs(session, true, next);
  };
  that.send = function(session, next) {
    logDimensionLabs(session, false, next);
  };

  function logDimensionLabs (session, isIncoming, next) {
    if (that.debug) {
      //console.log('\n*** MSFTBK Debug: ', (isIncoming ? 'incoming' : 'outgoing'), JSON.stringify(session, null, 2))
    }

    var data = {
      is_microsoft:true,
      dashbot_timestamp: new Date().getTime(),
      json: session
    };
    var platform = session.source ? session.source : _.get(session, 'address.channelId');

    // hack for facebook token
    if(platform === 'facebook' && that.facebookToken != null){
      data.token = that.facebookToken;
    }

    var apiKey = apiKeyMap[platform]
    if (!apiKey) {
      console.warn('**** Warning: No dimensionLabs apiKey for platform:(' + platform + ') Data not saved. ')
      next();
      return;
    }

    // if the platform is not supported by us, use generic
    if (_.indexOf(['facebook', 'kik', 'slack'], platform) === -1) {
      platform = 'generic';
    }

    var url = that.urlRoot + '?apiKey=' +
      apiKey + '&type=' + (isIncoming ? 'incoming' : 'outgoing') +
      '&platform=' + platform + '&v=' + VERSION + '-npm';
    if (that.debug) {
      console.log('\n*** dimensionLabs MSFT Bot Framework Debug **');
      console.log(' *** platform is ' + platform);
      console.log(' *** dimensionLabs Url: ' + url);
      console.log(JSON.stringify(data, null, 2));
    }
    makeRequest({
      uri: url,
      method: 'POST',
      json: data
    }, that.printErrors, that.config.redact, that.config.timeout);

    next();
  }

}

module.exports = DimensionlabsMicrosoftDeprecated;