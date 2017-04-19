var chai = require('chai');

var pc = require('../src/index.js');

// Sets user id as unit-test
pc.utilities.user("unit-test");

// Runs tests on server side on node js
// Tests are only valid  after 'npm run build-node'
describe('test utilities module', function() {
	describe('user call changing user id', function() {
		it('The user id should change to new value', function() {
			pc.utilities.user("testing");
			chai.assert.equal(pc.utilities.user(), require('../src/private/constants.js').idPrefix + "testing");
			// Return user id to original value
			pc.utilities.user("unit-test");
		});
	});

	describe('pcCheck call returning positive assuming pc operational', function() {
		var output1;

		beforeEach(function(done){
			pc.utilities.pcCheck().then(x => {
				output1 = x;
				done();
			});
		});

		it('The graph request should return true', function() {
			chai.assert.equal(output1, true);
		});
	});

	describe('pcCheck call returning negative', function() {
		var output1;

		beforeEach(function(done){
			// set impossibly low timeout to encourage a timeout failure
			pc.utilities.pcCheck(0.1).then(x => {
				output1 = x;
				done();
			});
		});

		it('The graph request should return false', function() {
			chai.assert.equal(output1, false);
		});
	});

	// sourceCheck tests done in test_graph.js
});
