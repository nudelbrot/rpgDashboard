'use strict';
var expect = require('chai').expect;

describe('config.js existence', () => {
      it('should exist', () => {
                var config = require('../src/config.js');
                expect(config).to.not.be.undefined;
            });
});

describe('create config', () => {
      it('should exist', () => {
                var config = require('../src/config.js');
                var cfg = new config.Config();
                expect(cfg).to.not.be.undefined;
            });
});

describe('load config', () => {
      it('should exist', () => {
                var config = require('../src/config.js');
                var cfg = new config.Config();
                cfg.load();
                expect(cfg).to.not.be.undefined;
            });
});

describe('save config', () => {
      it('should exist', () => {
                var config = require('../src/config.js');
                var cfg = new config.Config();
                cfg.save();
                expect(cfg).to.not.be.undefined;
            });
});
