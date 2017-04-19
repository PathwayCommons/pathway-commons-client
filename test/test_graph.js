var chai = require('chai');

var pc = require('../src/index.js');

// Sets user id as unit-test
pc.utilities.user("unit-test");

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test graph module', function() {
	describe('graph call with convenience function set', function() {
		this.timeout(40000);
		var output1;

		beforeEach(function(done){
			//done(); // Disables test
			pc.graph()
				.source("P11766", "uniprot")
				.kind("NEIGHBORHOOD")
				.format("JSONLD")
				.fetch()
				.then(function(x) {
					output1 = x;
					done();
				});
		});

		it('The graph request should return a non-empty object', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1, {});
		});
	});

	describe('graph call with query method set', function() {
		this.timeout(40000);
		var output1;

		beforeEach(function(done){
			//done(); // Disables test
			pc.graph()
				.query({
					source: "P11766",
					kind: "NEIGHBORHOOD",
					format: "JSONLD"
				})
				.fetch()
				.then(function(x) {
					output1 = x;
					done();
				});
		});

		it('The graph request should return a non-empty object', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1, {});
		});
	});

	describe('graph call with conv. function and invalid source name', function() {
		var output1;

		beforeEach(function(done){
			try {
				pc.graph()
					.source("P11766", "hi")
					.kind("NEIGHBORHOOD")
					.format("JSONLD")
					.fetch()
					.then(function(x) {
						done();
					})
			}
			catch(e) {
				output1 = e;
				done();
			};
		});

		it('The graph request should return a SyntaxError', function() {
			chai.assert.equal(output1.name, "SyntaxError");
			chai.assert.equal(output1.message, "hi is an invalid source");
		});
	});

	describe('graph call with conv. function and valid uniprot ID', function() {
		this.timeout(40000);
		var output1;

		beforeEach(function(done){
			//done(); // Disables test
			pc.graph()
				.source("P11766", "uniprot")
				.kind("NEIGHBORHOOD")
				.format("JSONLD")
				.fetch()
				.then(function(x) {
					output1 = x;
					done();
				});
		});

		it('The graph request should return a non-empty object', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1, {});
		});
	});

	describe('graph call with conv. function and invalid uniprot ID', function() {
		var output1;

		beforeEach(function(done){
			try {
				pc.graph()
					.source("P2090r8", "uniprot")
					.kind("NEIGHBORHOOD")
					.format("JSONLD")
					.fetch()
					.then(function(x) {
						done();
					})
			}
			catch(e) {
				output1 = e;
				done();
			};
		});

		it('The graph request should return a SyntaxError', function() {
			chai.assert.equal(output1.name, "SyntaxError");
			chai.assert.equal(output1.message, "P2090r8 is an invalid UNIPROT ID");
		});
	});

	describe('graph call with conv. function and valid CHEBI ID', function() {
		this.timeout(40000);
		var output1;

		beforeEach(function(done){
			//done(); // Disables test
			pc.graph()
				.source("CHEBI:16236", "chebi")
				.kind("NEIGHBORHOOD")
				.format("JSONLD")
				.fetch()
				.then(function(x) {
					output1 = x;
					done();
				});
		});

		it('The graph request should return a non-empty object', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1, {});
		});
	});

	describe('graph call with conv. function and invalid CHEBI ID', function() {
		var output1;

		beforeEach(function(done){
			try {
				pc.graph()
					.source("CHEBI:r16236", "chebi")
					.kind("NEIGHBORHOOD")
					.format("JSONLD")
					.fetch()
					.then(function(x) {
						done();
					})
			}
			catch(e) {
				output1 = e;
				done();
			};
		});

		it('The graph request should return a SyntaxError', function() {
			chai.assert.equal(output1.name, "SyntaxError");
			chai.assert.equal(output1.message, "CHEBI:r16236 is an invalid CHEBI ID");
		});
	});

	describe('graph call with conv. function and valid HGNC ID', function() {
		this.timeout(40000);
		var output1;

		beforeEach(function(done){
			//done(); // Disables test
			pc.graph()
				.source("IGFBP1", "hgnc")
				.kind("NEIGHBORHOOD")
				.format("JSONLD")
				.fetch()
				.then(function(x) {
					output1 = x;
					done();
				});
		});

		it('The graph request should return a non-empty object', function() {
			chai.assert.typeOf(output1, "object");
			chai.assert.notEqual(output1, {});
		});
	});

	describe('graph call with conv. function and invalid HGNC ID', function() {
		var output1;

		beforeEach(function(done){
			try {
				pc.graph()
					.source("!@#$%^&*", "hgnc")
					.kind("NEIGHBORHOOD")
					.format("JSONLD")
					.fetch()
					.then(function(x) {
						done();
					})
			}
			catch(e) {
				output1 = e;
				done();
			};
		});

		it('The graph request should return a SyntaxError', function() {
			chai.assert.equal(output1.name, "SyntaxError");
			chai.assert.equal(output1.message, "!@#$%^&* is an invalid HGNC ID");
		});
	});
});
