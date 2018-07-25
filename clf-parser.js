
const clfParser = require('clf-parser');

//Architectural adapter -- this allows for change of how we deal with lines and only one location of change
function parseLine( what ){
	return clfParser(what);
}

module.exports = {
	parseLine
}
