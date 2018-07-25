const yargs = require("yargs");
const fst = require("fs-tail-stream");

const {Alarm} = require("./alarms");
const {parseLine} = require("./clf-parser");
const {httpStats} = require("./stats");

const TWO_MINUTES_IN_MS =  2 * 60 * 1000;

function configureAlarm( samplePeriod, highWaterMark ) {
	const alarm = new Alarm( highWaterMark, samplePeriod );
	alarm.on("alarm", (average) =>{
		console.log("High traffic generated an alert - hits = "+average+", triggered at " + new Date());
	});
	alarm.on("ok", (average) =>{
		console.log("Traffic alarm returned to OK - hits = "+average+", returned at " + new Date());
	});
	return alarm;
}

function doFileTail( argv ){
	const highWaterMark = argv["high-water"];
	const samplesOverTwoMinutes = TWO_MINUTES_IN_MS / highWaterMark;
	const sampleTimeInMS = argv.period * 1000;

	try {
		const stats = httpStats();
		const alarm = configureAlarm(samplesOverTwoMinutes, highWaterMark);

		function report(){
			const report = stats.report();
			stats.reset();

			console.log("Report: ", report);
			alarm.sample(report.totalRequests);
		}

		const intervalToken = setInterval( report,  sampleTimeInMS );

		const fileName = argv.file;
		let accumulator = "";
		//TODO: File the file doesn't exist then we shouldn't error
		const input = fst.createReadStream(fileName, {encoding: 'utf8', start:0, tail:true});
		input.on('error', (why) =>{
			console.error("Failed to tail file: ", why);
		});
		input.on('data', (data) => {
			//TODO: Need stream to chunk strings
			accumulator = accumulator + data;
			const lines = accumulator.split("\n");
			accumulator = lines.splice(-1);
			lines.forEach((l) => {
				const result = parseLine(data);
				stats.consume( result );
			})
		})

		function shutdown() {
			input.close();
			clearInterval(intervalToken);
			report();
		}

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	}catch( e ){
		console.error("An error was encountered while starting: ", e);
	}
}

yargs.command( "tail [file]", "Tails the log file for ingestion", (yargs) => {
	yargs.positional("file", { description: "The file to tail", default: "/var/log/access.log" })
	yargs.option("period", { description: "Reporting period, in seconds", default: "10" })
	yargs.option("high-water", { description: "High water mark for service usage", default: 10 } )
}, doFileTail )
	.demandCommand()
	.help()
	.argv;