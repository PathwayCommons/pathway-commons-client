var chai = require('chai');

var pc = require('../src/index.js');

// Sets user id as unit-test
pc.utilities.user("unit-test");

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test traverse module', function() {
  describe('traverse call with object argument and fetch with promise', function() {
    var output1;

    beforeEach(function(done){
      pc.traverse()
        .query({
          uri: 'http://identifiers.org/reactome/R-HSA-201451',
          path: 'Entity/name'
        })
        .format('xml')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The traverse request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('traverse call with chained uri, path, and format functions', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.traverse()
        .uri('http://identifiers.org/reactome/R-HSA-201451')
        .path('Entity/name')
        .format('xml')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The traverse request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('traverse call with object argument and object format and output', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.traverse()
        .query({
          uri: 'http://identifiers.org/reactome/R-HSA-201451',
          path: 'Entity/name'
        })
        .format('json')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The traverse request should return a non-empty object', function() {
      chai.assert.typeOf(output1, "object");
    });
  });

  describe('traverse call with object argument and default format', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.traverse()
        .query({
          uri: 'http://identifiers.org/reactome/R-HSA-201451',
          path: 'Entity/name'
        })
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The traverse request should return a non-empty object', function() {
      chai.assert.typeOf(output1, "object");
    });
  });

  describe('traverse call with object argument and invalid uri', function() {
    var output1;

    beforeEach(function(done){
      pc.traverse()
        .query({
          uri: 'iiiiiiiiiiiiiiiiiiiiiiiii',
          path: 'Entity/name'
        })
        .fetch()
        .then(function(x) {
          output1 = x;
          done();
        });
    });

    it('The traverse request should return a null', function() {
      chai.assert.equal(output1, null);
    });
  });
});
