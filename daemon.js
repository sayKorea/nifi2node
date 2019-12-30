module.exports = {
	apps: [{
		name		: 'nifi interface ui',
		script		: './bin/www',
		instances	: 2,
		exec_mode	: 'cluster',
		args		: 'prod'
	}]
}
  