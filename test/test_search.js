var chai = require('chai');

var pc = require('../src/index.js');

// Sets user id as unit-test
pc.utilities.user("unit-test");

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test search module', function() {
  describe('search call with object argument and fetch with promise', function() {
    var output1;

    before(function(done){
      pc.search()
        .query({q: 'brca1'})
        .format('xml')
        .fetch()
        .then(function(x) {
          output1 = x;
          done();
        });
    });

    it('The search request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('search call with chained uri and format functions', function() {
    // Assume Promises supported
    var output1;

    before(function(done){
      pc.search()
        .q('brca1')
        .type('pathway')
        .format('xml')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The search request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('search call with object argument and object format and output', function() {
    // Assume Promises supported
    var output1;

    before(function(done){
      pc.search()
        .query({
          q: 'brca1'
        })
        .format('json')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The search request should return a non-empty object', function() {
      chai.assert.typeOf(output1, "object");
    });
  });

  describe('search call with object argument and default format', function() {
    // Assume Promises supported
    var output1;

    before(function(done){
      pc.search()
        .query({
          q: 'brca1'
        })
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The search request should return a non-empty object', function() {
      chai.assert.typeOf(output1, "object");
    });
  });

  describe('search call with object argument and invalid uri', function() {
    var output1;

    before(function(done){
      pc.search()
        .query({
          q: 'iiiiiiiiiiiiiiiiiiiiiiiii',
          format: 'json'
        })
        .fetch()
        .then(function(x) {
          output1 = x;
          done();
        });
    });

    it('The search request should return trivial result', function() {
      chai.assert.equal(output1.numHits, 0);
    });
  });
});
