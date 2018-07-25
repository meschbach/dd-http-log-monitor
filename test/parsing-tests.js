const expect = require("chai").expect;
const {parseLine} = require("../clf-parser");

describe( "clf-parser", function(){
	describe( "example line a", function(){
		beforeEach(function(){
			this.result = parseLine("127.0.0.1 - james [09/May/2018:16:00:39 +0000] \"GET /report HTTP/1.0\" 200 1234")
		});

		it( "remote client is 127.0.0.1", function(){ expect(this.result.remote_addr).to.eq("127.0.0.1"); })
		it( "name is james", function(){ expect(this.result.remote_user).to.eq("james"); });
		it( "extracts the date", function(){
			//TODO: Verify the drift and if we are
			expect(this.result.time_local.toString()).to.eq( new Date("2018-05-09 16:00:39 +0000").toString() );
		});
		it( "extracts the path", function(){
			expect(this.result.path).to.eq("/report");
		} )
	} )

	describe( "example line b", function(){
		beforeEach(function(){
			this.result = parseLine("127.0.0.1 - jill [09/May/2018:16:00:41 +0000] \"GET /api/user HTTP/1.0\" 200 1234")
		});

		it( "remote client is 127.0.0.1", function(){ expect(this.result.remote_addr).to.eq("127.0.0.1"); })
		it( "name is james", function(){ expect(this.result.remote_user).to.eq("jill"); });
		it( "extracts the date", function(){
			//TODO: Verify the drift and if we are
			expect(this.result.time_local.toString()).to.eq( new Date("2018-05-09 16:00:41 +0000").toString() );
		});
		it( "extracts the path", function(){
			expect(this.result.path).to.eq("/api/user");
		} )
	} )

	describe( "example line c", function(){
		beforeEach(function(){
			this.result = parseLine("127.0.0.1 - frank [09/May/2018:16:00:42 +0000] \"GET /api/user HTTP/1.0\" 200 1234")
		});

		it( "remote client is 127.0.0.1", function(){ expect(this.result.remote_addr).to.eq("127.0.0.1"); })
		it( "name is james", function(){ expect(this.result.remote_user).to.eq("frank"); });
		it( "extracts the date", function(){
			//TODO: Verify the drift and if we are
			expect(this.result.time_local.toString()).to.eq( new Date("2018-05-09 16:00:42 +0000").toString() );
		});
		it( "extracts the path", function(){
			expect(this.result.path).to.eq("/api/user");
		} )
	} )

	describe( "example line d", function(){
		beforeEach(function(){
			this.result = parseLine("127.0.0.1 - mary [09/May/2018:16:00:42 +0000] \"GET /api/user HTTP/1.0\" 200 1234")
		});

		it( "remote client is 127.0.0.1", function(){ expect(this.result.remote_addr).to.eq("127.0.0.1"); })
		it( "name is james", function(){ expect(this.result.remote_user).to.eq("mary"); });
		it( "extracts the date", function(){
			//TODO: Verify the drift and if we are
			expect(this.result.time_local.toString()).to.eq( new Date("2018-05-09 16:00:42 +0000").toString() );
		});
		it( "extracts the path", function(){
			expect(this.result.path).to.eq("/api/user");
		} )
	} )
});
