var chai = require('chai');

var pc = require('../src/index.js');

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test dataSources module', function() {
	describe('get call using promises', function() {
		// Assume Promises supported
		var output1;

		beforeEach(function(done){
			pc.dataSources.get().then(function(x) {
				output1 = x;
				done();
			});
		});

		it('The get request should return a non-empty array', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1.length, {});
		});
	});

	describe('get call using callback', function() {
		var output1;

		beforeEach(function(done){
			pc.dataSources.get(function(x) {
				output1 = x;
				done();
			});
		});

		it('The get request should return a non-empty array', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1.length, {});
		});
	});

	describe('fetch call using promises', function() {
		// Assume Promises supported
		var output1;

		beforeEach(function(done){
			pc.dataSources.fetch().then(function(x) {
				output1 = x;
				done();
			});
		});

		it('The get request should return a non-empty array', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1.length, {});
		});
	});
});
