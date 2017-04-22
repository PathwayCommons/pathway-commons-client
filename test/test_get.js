var chai = require('chai');

var pc = require('../src/index.js');

// Sets user id as unit-test
pc.utilities.user("unit-test");

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test get module', function() {
  describe('get call with object argument and fetch with callback', function() {
    var output1;

    beforeEach(function(done){
      pc.get()
        .query({uri: 'http://identifiers.org/reactome/R-HSA-201451'})
        .fetch()
        .then(function(x) {
          output1 = x;
          done();
        });
    });

    it('The get request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('get call with chained uri and format functions', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.get()
        .uri('http://identifiers.org/reactome/R-HSA-201451')
        .format('SBGN')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The get request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('get call with object argument and promise fetch', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.get()
        .query({
          uri: 'http://identifiers.org/reactome/R-HSA-201451',
          format: 'SBGN'
        })
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The get request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('get call with object argument and object format and output', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.get()
        .query({
          uri: 'http://identifiers.org/reactome/R-HSA-201451',
          format: 'JSONLD'
        })
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The get request should return a non-empty object', function() {
      chai.assert.typeOf(output1, "object");
    });
  });

  describe('get call with object argument and invalid uri', function() {
    var output1;

    beforeEach(function(done){
      pc.get()
        .query({
          uri: 'iiiiiiiiiiiiiiiiiiiiiiiii',
          format: 'JSONLD'
        })
        .fetch()
        .then(function(x) {
          output1 = x;
          done();
        });
    });

    it('The get request should return a null', function() {
      chai.assert.equal(output1, null);
    });
  });
});
