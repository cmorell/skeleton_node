var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	modelsDir : rootPath + '/app/models',
	PERIODICAL_SYNC_DB_TIMER: 5000,
	wakeuptime: 5,
	WAKEUP_TIMEOUT: 20,
	SYNC_TIMEOUT: 20,
	timeout_by_file: 1000,
    max_timeout_zip_creation: 120000,
    min_timeout_zip_creation: 10000,
     app: {
        name: "app_name"
    },
}
