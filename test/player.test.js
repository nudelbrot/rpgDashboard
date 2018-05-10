'use strict';
var expect = require('chai').expect;

describe('player.js existence', function() {
      it('should exist', function() {
                var player = require('../src/player.js');
                expect(player).to.not.be.undefined;
            });
});
