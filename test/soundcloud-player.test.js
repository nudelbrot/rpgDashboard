'use strict';
var expect = require('chai').expect;

describe('player/soundcloud.js existence', function() {
      it('should exist', function() {
                var soundcloud = require('../src/player/soundcloud.js');
                expect(soundcloud).to.not.be.undefined;
            });
}); 
