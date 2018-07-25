	I erred on the side of not over engineering a solution for this particular exercise.  However to bring this into
	production I would have the following improvements and concerns which I would address.  Since the application is
	required to dump data on `stdout` in place of a real UI it would require active monitoring of that file descriptor.
	Adding a system to notify on alarms and perhaps storing the digested data would be the first step in productizing
	the system.
	
	For the application execution environment there are a few nice to haves missing such as: application logging, better
	signal handling, and cleaner application initialization.  Adding a simple logger like Bunyan would ease debugging
	and maintenance burdens greatly.  Optionally one could ship those logs and aggregate across a cluster.  Signal
	handling is implemented to a bare minimum to cleanly exist from Docker and defaults to using Node’s `SIGINT`
	when run locally.  This could be expanded to reopen the file or reset the stats on other signals.  Within the entry
	point invoked by option parser `yargs` the code could be further decomposed into finer grained responsibilities so
	it could at least deal with just the wiring.
	
	The data source ingestion is directly setup and managed within the entry point.  This would make expansion to
	additional data sources or even monitoring for the file creation difficult.  Moving creation of the source out would
	ease these burdens and encourage future maintainers to build a source agnostic pipeline with little effort.  With
	movement of these concerns the application would be able to digest additional sources from web sockets or stdin with
	little effort, although it would still be tied to a single host.
	
	I feel like I cheated a bit by using an out of the box solution for parsing the CLF.  At first I began writing a
	parser myself however the existing solution worked with minimal effort.  The library performs reasonably well,
	parsing more than 1000 entires in less than a second.  If you would like I could write the parser myself if you
	want.  Within clf-parser.js there is a seam function which isolates the parsers and resulting format from the
	remainder of the application.  I was surprised at how few Line-chunking Readable Streams were out there; an
	opportunity to contribute back to the community.
	
	Although I built a few functions to reduce the parsed entry into data of interest the processing pipeline itself is
	hard coded to a small subset.  Building a more confinable pipeline would make a better product if there is more data
	of interest.  From a design perspective of `httpStats` we really have an object (data + behavior) being returned but
	scoped to the factory.  An object design would clean up scoping and perhaps reduce intellectual burden in the
	future.  If the digesting state was viewed as a composite state similar to Redux we could simplify resetting making
	maintenance cycles easier and provide a way to build the outgoing pipeline.
	
	The Alarm is a very simple implementation taking averages over all samples.  I avoided implementing rolling averages
	due to increased complexity of implementation.  If the web server is very busy the current implementation of the
	rolling window will generate a lot of garbage and produce high CPU loads to collect it.  Node tends to perform on
	I/O loads well but CPU load is somewhere to be cautious.  To remediate that would be using a ring buffer for the
	samples, reducing the amount of garbage produce.  If CPU load was the biggest concern then sharding out the parsing
	to additional cores would be helpful; either on host or on different hosts.
	
	Overall I am not a fan of logically digesting these resources on the same node as the web server as using a file
	would imply since it would be competing with servicing the requests.  Although you may find spare cycles or
	configure a kernel to run these applications at a lower priority than the service, I feel it would be better to ship
	the logs to another logical host and digest them in a scalable pool according to SLA and value they provide.
	