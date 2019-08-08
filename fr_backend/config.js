module.exports = {
	mysql: {
	    host: "localhost",
	    user: "root",
	    password: "mysql",
	    database: "fitting_room"
	},
	log4js: {
		appenders: { 
			file: { 
				type: 'datefile', 
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