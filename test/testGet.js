var chai = require('chai');

var pc = require('../build/bundle.js');

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test get module', function() {
	describe('get call with object argument and fetch with anon. function', function() {
		var output1;

		beforeEach(function(done){
			new pc.get({
				uri: 'http://pathwaycommons.org/pc2/Protein_uniprotkb_Q06609_identity_1460949191635'
			}).fetch(function(x) {
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
		var output1;

		beforeEach(function(done){
			new pc.get()
				.uri('http://pathwaycommons.org/pc2/Protein_uniprotkb_Q06609_identity_1460949191635')
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
		var output1;

		beforeEach(function(done){
			new pc.get()
				.query({
					uri: 'http://pathwaycommons.org/pc2/Protein_uniprotkb_Q06609_identity_1460949191635',
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
		var output1;

		beforeEach(function(done){
			new pc.get()
				.query({
					uri: 'http://pathwaycommons.org/pc2/Protein_uniprotkb_Q06609_identity_1460949191635',
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
			new pc.get({
				uri: 'iiiiiiiiiiiiiiiiiiiiiiiii',
				format: 'JSONLD'
			}).fetch(function(x) {
				output1 = x;
				done();
			});
		});

		it('The get request should return an empty string', function() {
			chai.assert.typeOf(output1, "boolean");
			chai.assert.equal(output1, false);
		});
	});

	describe('get call with object argument and uniprod uri set', function() {
		var output1;

		beforeEach(function(done){
			new pc.get()
				.uniprot("Q06609")
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
});
