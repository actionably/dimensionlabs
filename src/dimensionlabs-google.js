/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict'

var makeRequest = require('./make-request')
var DimensionLabsBase = require('./dimensionlabs-base');
var VERSION = require('../package.json').version;

function DimensionlabsGoogle(apiKey, urlRoot, debug, printErrors, config) {
  var that = new DimensionLabsBase(apiKey, urlRoot, debug, printErrors, config, 'google');

  that.assistantHandle = null;
  that.requestBody = null;

  that.configHandler = function(assistant, incomingMetadata){
    if (assistant == null) {
      throw new Error('YOU MUST SUPPLY THE ASSISTANT OBJECT TO DIMENSIONLABS!');
    }

    that.assistantHandle = assistant;

    // assistant/conversation library path
    if (that.configAssistantConversation(assistant, incomingMetadata)) {
      return
    }

    if (typeof assistant.doResponse_ !== 'undefined') {
      that.assistantHandle.originalDoResponse = assistant.doResponse_;
      that.assistantHandle.doResponse_ = dimensionLabsDoResponse;
      that.requestBody = assistant.body_;
      that.logIncoming(assistant.body_, incomingMetadata);
    } else if (typeof assistant.handleRequest !== 'undefined') {
      // dialogflow-fulfillment npm
      that.assistantHandle.client.orginalSend = assistant.client.sendJson_;
      that.assistantHandle.client.sendJson_ = dimensionLabsSend;
      that.requestBody = assistant.request_.body;
      that.logIncoming(assistant.request_.body, incomingMetadata);
    } else {
      that.assistantHandle.originalhandler = assistant.handler.bind(assistant);
      that.assistantHandle.handler = dimensionLabsDoResponseV2;
      that.incomingMetadata = incomingMetadata
    }
  };

  function dimensionLabsSend(responseJson) {
    that.logOutgoing(that.requestBody, responseJson, that.outgoingMetadata, that.outgoingIntent)
    that.outgoingMetadata = null
    that.outgoingIntent = null
    that.assistantHandle.client.orginalSend(responseJson)
  }

  function dimensionLabsDoResponse(response, responseCode) {
    that.logOutgoing(that.requestBody, response, that.outgoingMetadata, that.outgoingIntent)
    that.outgoingMetadata = null
    that.outgoingIntent = null
    that.assistantHandle.originalDoResponse(response, responseCode);
  }

  function dimensionLabsDoResponseV2(body, headers) {
    that.logIncoming(body, that.incomingMetadata);
    return that.assistantHandle.originalhandler(body, headers).then(function(response){
      that.logOutgoing(body, response.body, that.outgoingMetadata, that.outgoingIntent)
      that.outgoingMetadata = null
      that.outgoingIntent = null
      return response
    })
  }

  function internalLogIncoming(data, source) {
    var url = that.urlRoot + '?apiKey=' +
      that.apiKey + '&type=incoming&platform=' + that.platform + '&v=' + VERSION + '-' + source;
    if (that.debug) {
      console.log('DimensionLabs Incoming: ' + url);
      console.log(JSON.stringify(data, null, 2));
    }
    return makeRequest({
      uri: url,
      method: 'POST',
      json: data
    }, that.printErrors, that.config.redact, that.config.timeout);
  }

  function internalLogOutgoing(data, source) {
    var url = that.urlRoot + '?apiKey=' +
      that.apiKey + '&type=outgoing&platform=' + that.platform + '&v=' + VERSION + '-' + source;
    if (that.debug) {
      console.log('DimensionLabs Outgoing: ' + url);
      console.log(JSON.stringify(data, null, 2));
    }
    return makeRequest({
      uri: url,
      method: 'POST',
      json: data
    }, that.printErrors, that.config.redact, that.config.timeout);
  }

  that.setOutgoingMetadata = function(outgoingMetadata) {
    that.outgoingMetadata = outgoingMetadata
  }

  that.setOutgoingIntent = function(outgoingIntent) {
    that.outgoingIntent = outgoingIntent
  }

  that.setNotHandled = function() {
    that.outgoingIntent = {
      name: 'NotHandled'
    }
  }

  that.logIncoming = function(requestBody, metadata, intent) {
    var timestamp = new Date().getTime();
    var data = {
      dashbot_timestamp: timestamp,
      request_body:requestBody
    };
    if (metadata) {
      data.metadata = metadata
    }
    if (intent) {
      data.intent = intent
    }
    internalLogIncoming(data, 'npm');
  };

  that.logOutgoing = function(requestBody, message, metadata) {
    var timestamp = new Date().getTime();
    var data = {
      dashbot_timestamp: timestamp,
      request_body:requestBody,
      message:message
    };
    if (metadata) {
      data.metadata = metadata
    }
    if (that.outgoingIntent) {
      data.intent = that.outgoingIntent;
    }
    internalLogOutgoing(data, 'npm');
  };

  that.configAssistantConversation = function(app, incomingMetadata) {
    if (typeof app.handler === 'undefined') {
      return false
    }

    try {
      require('@assistant/conversation');
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e
      }

      return false
    }

    // try integrating
    that
      .setFulfillmentLib('@assistant/conversation')
      .attachConversationApiHandler(app, incomingMetadata)
      .attachDimensionLabsHandle(app)

    return true;
  }

  that.attachDimensionLabsHandle = function(app) {
    app.handle('dimensionLabs', conv => { return conv })
    return that
  }

  that.setFulfillmentLib = function(name) {
    that.fulfillmentLib = name;
    return that
  }

  that.attachConversationApiHandler = function(app, incomingMetadata) {
    var _handler = app.handler.bind(app)

    const dimensionLabs = async (body, headers, metadata) => {
      var resp = await _handler(body, headers, metadata)

      that.logIncoming({ request: body,  fulfillmentLib: that.fulfillmentLib }, incomingMetadata)
      that.logOutgoing(
        { request: body,  fulfillmentLib: that.fulfillmentLib },
        { response: resp,  fulfillmentLib: that.fulfillmentLib },
        that.outgoingMetadata
      );

      that.outgoingMetadata = null
      that.outgoingIntent = null
      return resp
    }

    app.handler = dimensionLabs
    return that
  }

  return that;
}


module.exports = DimensionlabsGoogle;
