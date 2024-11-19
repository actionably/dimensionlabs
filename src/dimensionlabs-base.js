/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict'

var _ = require('lodash');
var EventLogger = require('./event-logger')
var DimensionLabsEventUtil = require('./event-util')


function DimensionlabsBase(apiKey, urlRoot, debug, printErrors, config, platform) {
  var that = this;
  that.apiKey = apiKey;
  that.platform = platform;
  that.urlRoot = urlRoot;
  that.debug = debug;
  that.printErrors = printErrors;
  that.eventLogger = new EventLogger(apiKey, urlRoot, debug, printErrors, config, platform);
  that.config = config;
  that.eventUtil = new DimensionLabsEventUtil()

  that.logEvent = function(data) {
    return that.eventLogger.logEvent(data);
  }

}

module.exports = DimensionlabsBase;