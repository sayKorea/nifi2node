module.exports = {
	apps: [{
		name: 'interface ui',
		script:'./bin/www',
		args: 'prod',
		watch: true,
		ignore_watch : ["node_modules", "logs", "uploads"],
		watch_options: {
				"followSymlinks": false
		}
	}]
}
