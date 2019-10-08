module.exports = {
	mysql: {
	    host: "localhost",
	    user: "root",
	    password: "mysql",
	    database: "fitting_room"
	},
	photo_path: 'd:/fitting_room',
	photo: {
		"path": {
			"preview": "d:/fitting_room/preview"
		},
		"file": {
			"type": "image/jpeg",
			"size": 500,
			"width": 1108,
			"height": 1477
		}
	},
	log4js: {
		appenders: { 
			file: { 
				type: 'dateFile', 
				filename: 'd:/var/log/fitting_room/backend.log',
				backups: 3,
				compress: true, // compress the backups
				encoding: 'utf-8'
			},
			console: { 
				type: 'console',
				layout: {
					type: 'pattern',
					pattern: '%[%r (%x{pid}) %p %c -%] %m%n',
					tokens: {
						pid: function () { return process.pid; }
					}
				}
			}
		},
		categories: { 
			default: { 
				appenders: ['file', 'console'], 
				level: 'debug' 
			}
		}
	}
}