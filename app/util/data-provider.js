var targetDb,
	referenceDb;
module.exports = {
	targetDb: function() {
		if(typeof targetDb === 'undefined') {
			var PouchDB = require('pouchdb-core')
	      		.plugin(require('pouchdb-adapter-leveldb'));
	      	targetDb = new PouchDB(`${__dirname}/../../db/targetDB`);
	      }
		return targetDb;
	},
	referenceDb: function() {
		if(typeof referenceDb === 'undefined') {
			var PouchDB = require('pouchdb-core')
	      		.plugin(require('pouchdb-adapter-leveldb'));
	      	referenceDb = new PouchDB(`${__dirname}/../../db/referenceDB`);
		}
		return referenceDb;
	}
}