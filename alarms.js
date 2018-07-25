
const EventEmitter = require("events");

class Alarm extends EventEmitter {
	constructor(threshold, sampleCount = 3){
		super();

		this.threshold = threshold;
		this.triggered = false;
		this.samples = [];
		this.sampleCount = sampleCount;
	}

	sample(count){
		//TODO: Replace with ring buffer
		this.samples.push(count);
		if( this.samples.length > this.sampleCount ){
			const size = this.samples.length - this.sampleCount;
			this.samples.splice( 0, size)
		}

		//TODO: Replace with rolling average
		const sum = this.samples.reduce( (r, i) => r+i , 0)
		const average = (sum * 1.0) / this.samples.length;
		const wasTriggered = this.triggered;

		this.triggered = average >= this.threshold;

		//Dispatch state changes
		if( wasTriggered != this.triggered ){
			if( this.triggered ){
				this.emit("alarm", average);
			} else {
				this.emit("ok", average);
			}
		}
	}
}

module.exports = {
	Alarm
}
