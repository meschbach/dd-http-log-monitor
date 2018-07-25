const expect = require("chai").expect;
const {Alarm} = require("../alarms");

describe("Alarm", function(){
	describe( "initial state", function(){
		it("is not triggered", function(){
			const alarm = new Alarm();
			expect(alarm.triggered).to.eq(false);
		})
	});

	describe("when receiving a single sample over the threshold", function(){
		it("is triggered", function(){
			const alarm = new Alarm(99);
			alarm.sample(100);
			expect(alarm.triggered).to.eq(true);
		})

		it( "notifies when alarming", function(){
			const alarm = new Alarm(99);
			let event = false;
			alarm.on("alarm", () => {
				event = true;
			});
			alarm.sample(100);
			expect(event).to.eq(true);
		})

		describe("when the next sample bering it below the threshold", function(){
			it( "is no longer triggered", function(){
				const alarm = new Alarm(99);
				alarm.sample(100);
				alarm.sample(97);
				expect(alarm.triggered).to.eq(false);
			})

			it( "notifies when no longer alarming", function(){
				const alarm = new Alarm(99);
				let ok = false;
				alarm.sample(100);
				alarm.on("ok", () => {
					ok = true;
				});
				alarm.sample(97);
				expect(ok).to.eq(true);
			})
		})
	})
});
