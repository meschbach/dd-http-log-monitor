

function httpStats() {
	let totalRequests = 0;

	let sections = {};
	let statuses = {};

	function sumBin( bins, bin ){
		const contained = bins[bin] || 0;
		const result = contained + 1;
		bins[bin] = result;
		return result;
	}

	function entryToSection( entry ){
		if( !entry.path ){ return null; }

		const path = entry.path;
		const firstSlash = path.indexOf("/");
		const secondSlash = path.indexOf( "/" , firstSlash +1 );
		if( secondSlash == -1 ){ return path; }
		return path.substring(0,secondSlash);
	}

	function entryToStatus( entry ){
		return entry.status;
	}

	function simplifyStatus( status ){
		const statusRounded = Math.floor(status / 100);
		return statusRounded * 100;
	}

	return {
		reset: function() {
			totalRequests = 0;
			sections = {};
			statuses = {};
		},
		consume: function(entry) {
			totalRequests++;

			const section = entryToSection(entry);
			sumBin( sections, section );
			sumBin( statuses, simplifyStatus(entryToStatus(entry)) );
		},
		report: function() {
			return {
				totalRequests,
				mostHits: Object.keys(sections).sort((lhs,rhs) => sections[rhs] - sections[lhs]).map( (section) =>{
					return {section, count: sections[section]};
				}),
				statuses
			}
		}
	}
}

module.exports = {
	httpStats
}