'use strict';
var expect = require('chai').expect;

describe('player/youtube.js existence', function() {
      it('should exist', function() {
                var youtube = require('../src/player/youtube.js');
                expect(youtube).to.not.be.undefined;
            });
});

