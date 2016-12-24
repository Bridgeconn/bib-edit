const PouchDB = require('pouchdb');

function destroyDbs() {
    const targetDb = new PouchDB('./db/targetDB');
    targetDb.destroy().then(function (response) {
	console.log('targetDB destroyed!.');
	targetDb.close();
    }).catch(function (err) {
	console.log(err);
	targetDb.close();
    });

    const refDb = new PouchDB('./db/referenceDB');
    refDb.destroy().then(function (response) {
	console.log('referenceDB destroyed!');
	refDb.close();
    }).catch(function (err) {
	console.log(err);
	refDb.close();
    });
}

function setupTargetDb() {
    const targetDb = new PouchDB('./db/targetDB');    
    targetDb.get('isDBSetup')
	.then(function (doc) {
	    targetDb.close();    
	})
	.catch(function (err) {
	    const bibleJson = require('../app/lib/full_bible_skel.json');
	    targetDb.bulkDocs(bibleJson)
		.then(function (response) {
		    console.log('Successfully setup Target DB.');
		    targetDb.close();
		})
		.catch(function (err) {
		    console.log(err);
		    targetDb.close();
		});
	});
}

function setupRefDb() {
    var refDb = new PouchDB('./db/referenceDB');
    refDb.get('refs')
	.then(function (doc) {
	    refDb.close();
	})
	.catch(function (err) {
	    const refEnUlbJson = require('../app/lib/en_ulb.json'),
		  refEnUdbJson = require('../app/lib/en_udb.json'),
		  refHiUlbJson = require('../app/lib/hi_ulb.json'),
		  chunksJson = require('../app/lib/chunks.json'),
		  refsConfigJson = require('../app/lib/refs_config.json');	    
	    refDb.put(chunksJson)	
		.then(function (response) {
		    return refDb.put(refsConfigJson);
		})
		.then(function (response) {
		    return refDb.bulkDocs(refEnUlbJson);
		})
		.then(function (response) {
		    return refDb.bulkDocs(refEnUdbJson);
		})
		.then(function (response) {
		    return refDb.bulkDocs(refHiUlbJson);
		})
		.then(function (response) {
		    console.log('Successfully loaded reference texts.');
		    refDb.close();
		})
		.catch(function (err) {
		    console.log('Error loading reference data.' + err);
		    refDb.close();
		});
	});
}

//destroyDbs();
setupRefDb();
setupTargetDb();
