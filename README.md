# HTTP Log Monitor

Monitors a file in [Common Log Format](https://en.wikipedia.org/wiki/Common_Log_Format) and produces a digest of the data periodically.


## Usage

This application may be either launched locally as a command line NodeJS application or through Docker.

### Local
Initial setup:
```bash
npm install
```

Running locally:
```bash
node cli tail
```

### Docker

Building the image:
```bash
docker build . --squash --tag dd-http-log-monitor:wip
```
If you are rapidly iterating on the container build you should omitt the `--squash` option to better utilize the build
cache.

Running the application without rebuilding:
```
docker run --rm -v $PWD:/app -v /var/log:/var/log dd-http-log-monitor
```

### Testing
```
npm test
```
