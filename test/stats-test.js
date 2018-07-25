const expect = require("chai").expect;
const {httpStats} = require("../stats");

describe("HttpStats", function(){
	beforeEach(function(){
		this.stats = httpStats();
	});

	describe("with no events", function() {
		describe("report", function(){
			beforeEach(function(){
				this.report = this.stats.report();
			});

			it( "has the total nubmer of requests", function(){
				expect(this.report.totalRequests).to.eq(0);
			});
			it( "has no most hits", function(){
				expect(this.report.mostHits.length).to.eq(0);
			});
			it( "has no statuses", function(){
				expect(Object.keys(this.report.statuses)).to.deep.eq([]);
			});
		})
	})

	describe("with a single event", function() {
		beforeEach(function(){
			this.stats.consume({
				path: "/caravan/palace",
				status: 200
			});
		});

		describe("report", function(){
			beforeEach(function(){
				this.report = this.stats.report();
			});

			it( "has the total nubmer of requests", function(){
				expect(this.report.totalRequests).to.eq(1);
			});
			it( "only the single most hit", function(){
				expect(this.report.mostHits.length).to.eq(1);
				expect(this.report.mostHits.map( (e) => e.section)).to.deep.eq(["/caravan"]);
			});

			it( "has a single status", function(){
				expect(Object.keys(this.report.statuses)).to.deep.eq(["200"]);
			});
		})
	})


	describe("with multiple events", function() {
		beforeEach(function(){
			this.stats.consume({path: "/certificates/test", status: 200});
			this.stats.consume({path: "/ingress/plain", status: 201});
			this.stats.consume({path: "/ingress/plain", status: 422});
			this.stats.consume({path: "/walking/robot", status: 404});
			this.stats.consume({path: "/certificates/test", status: 200});
			this.stats.consume({path: "/certificates/test", status: 503});
		});

		describe("report", function(){
			beforeEach(function(){
				this.report = this.stats.report();
			});

			it( "has the total nubmer of requests", function(){
				expect(this.report.totalRequests).to.eq(6);
			});

			it( "bins the most often hit", function(){
				expect(this.report.mostHits.length).to.eq(3);
			});

			it( "reports most often hit section correctly", function(){
				expect(this.report.mostHits.map( (e) => e.section)).to.deep.eq(["/certificates", "/ingress","/walking"]);
			});
			it( "has the correct count", function(){
				expect(this.report.mostHits.map( (e) => e.count)).to.deep.eq([3,2,1]);
			});

			it( "has the correct statuses", function(){
				expect(this.report.statuses).to.deep.eq({
					200: 3,
					400: 2,
					500: 1
				});
			});
		})
	})
})
