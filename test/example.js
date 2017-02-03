var chai = require('chai');

var pc = require('../build/bundle.js');

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test get module', function() {
	describe('get fetch 1', function() {
		var output1;
		var output2;

		beforeEach(function(done){
			new pc.get({
				uri: 'http://pathwaycommons.org/pc2/Protein_uniprotkb_Q06609_identity_1460949191635',
				format: 'JSONLD'
			}).fetch(function(x, y) {
				output1 = x;
				output2 = y;
				done();
			});
		});

		it('The get request status string should be succeed', function() {
			chai.expect(output1).to.equal("SUCCESS");
		});
	});

	describe('get fetch 2', function() {
		var output;

		beforeEach(function(done){
			new pc.get()
				.uri('http://pathwaycommons.org/pc2/Protein_uniprotkb_Q06609_identity_1460949191635')
				.format('JSONLD')
				.fetch()
				.then(function(obj) {
					output = obj;
					done();
				});
		});

		it('The get request status string should be succeed', function() {
			chai.expect(output.status).to.equal("SUCCESS");
		});
	});

	describe('get fetch 3', function() {
		var output;

		beforeEach(function(done){
			new pc.get()
				.query({
					uri: 'http://pathwaycommons.org/pc2/Protein_uniprotkb_Q06609_identity_1460949191635',
					format: 'JSONLD'
				})
				.fetch()
				.then(function(obj) {
					output = obj;
					done();
				});
		});

		it('The get request status string should be succeed', function() {
			chai.expect(output.status).to.equal("SUCCESS");
		});
	});
});
