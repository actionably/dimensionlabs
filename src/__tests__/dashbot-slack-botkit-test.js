/* Copyright (c) 2016-2025 Dimension Labs Inc All rights reserved */
'use strict'

const dimensionLabs = require('../dimensionlabs')('mockapikey',
  {urlRoot: 'http://localhost:3000', debug:true}).slack;

const assert = require('assert')

describe('Slack', function() {
  describe('.addTeamInfo()', function() {
    it('GIVEN there is no team info information ' +
        'WHEN constructing the response ' +
        'THEN we set the team info to unknown', function() {

      const bot = {
        identity: {
          id: 'foo'
        },
        config: {
          token: 'foo'
        }
      }
      const message = {
      }

      const retValue = dimensionLabs._addTeamInfo(bot, message)

      assert.equal(retValue.team.id, 'unknown')
      assert.equal(retValue.team.name, 'unknown')
    })
  })
})