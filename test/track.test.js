'use strict';
var expect = require('chai').expect;

describe('track.js existence', function() {
      it('should exist', function() {
                var track = require('../src/track.js');
                expect(track).to.not.be.undefined;
            });
});
