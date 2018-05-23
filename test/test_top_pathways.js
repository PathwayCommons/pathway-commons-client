var chai = require('chai');

var pc = require('../src/index.js');

// Sets user id as unit-test
pc.utilities.user("unit-test");

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test top_pathways module', function() {
  describe('top_pathways call with object argument and fetch with promise', function() {
    var output1;

    beforeEach(function(done){
      pc.top_pathways()
        .query({
          q: 'bmp',
          datasouce: 'reactome'
        })
        .format('xml')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The top_pathways request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('top_pathways call with chained q, datasource, and format functions', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.top_pathways()
        .q('bmp')
        .datasource('reactome')
        .format('xml')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The top_pathways request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('top_pathways call with chained datasource array', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.top_pathways()
        .q('bmp')
        .datasource(['reactome', 'pid'])
        .format('xml')
        .fetch()
        .then(function(str) {
          output1 = str;
          done();
        });
    });

    it('The top_pathways request should return a non-empty string', function() {
      chai.assert.typeOf(output1, "string");
      chai.assert.isAbove(output1.length, 1);
    });
  });

  describe('top_pathways call with object argument and object format and output', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.top_pathways()
        .query({
          q: 'bmp',
          datasouce: 'reactome'
        })
        .format('json')
        .fetch()
        .then(function(obj) {
          output1 = obj;
          done();
        });
    });

    it('The top_pathways request should return a non-empty object', function() {
      chai.assert.typeOf(output1, "object");
    });
  });

  describe('top_pathways call with object argument and default format', function() {
    // Assume Promises supported
    var output1;

    beforeEach(function(done){
      pc.top_pathways()
        .query({
          q: 'bmp',
          datasouce: 'reactome'
        })
        .fetch()
        .then(function(obj) {
          output1 = obj;
          done();
        });
    });

    it('The top_pathways request should return a non-empty object', function() {
      chai.assert.typeOf(output1, "object");
    });
  });

  describe('top_pathways call with object argument and invalid uri', function() {
    var output1;

    beforeEach(function(done){
      pc.top_pathways()
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

    it('The top_pathways request should return a null', function() {
      chai.assert.typeOf(output1,"object");
      chai.assert.equal(output1.searchHit, false);
      chai.assert.equal(output1.numHits, 0);
    });
  });
});
