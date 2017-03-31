var chai = require('chai');

var pc = require('../src/index.js');

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test datasources module', function() {
	describe('fetch call using promises', function() {
		// Assume Promises supported
		var output1;

		beforeEach(function(done){
			pc.datasources.fetch().then(function(x) {
				output1 = x;
				done();
			});
		});

		it('The fetch request should return a non-empty array', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1.length, {});
		});
	});

	describe('refresh call using promises', function() {
		// Assume Promises supported
		var output1;

		beforeEach(function(done){
			pc.datasources.refresh().then(function(x) {
				output1 = x;
				done();
			});
		});

		it('The refresh request should return a non-empty array', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1.length, {});
		});
	});

	describe('get valid icon url for reactome', function() {
		// Assume Promises supported
		var output1;

		beforeEach(function(done){
			pc.datasources.lookupIcon("reactome").then(function(x) {
				output1 = x;
				done();
			});
		});

		it('The get request should return a non-empty string', function() {
			chai.assert.typeOf(output1, "string");
			chai.assert.notEqual(output1.length, 0);
		});
	});

	describe('get invalid icon url', function() {
		// Assume Promises supported
		var output1;

		beforeEach(function(done){
			pc.datasources.lookupIcon("nodata").then(function(x) {
				output1 = x;
				done();
			});
		});

		it('The get request should return undefined', function() {
			chai.assert.typeOf(output1, "undefined");
		});
	});
});
