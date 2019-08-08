const config = require('./config');
var log4js = require('log4js');

log4js.addLayout('json', config => function (logEvent) {
  return JSON.stringify(logEvent) + config.separator;
});

log4js.configure(config.log4js);

module.exports = { 
  log4js: log4js,
  express: log4js.connectLogger(
  	log4js.getLogger('access'), 
  	{
  		level: log4js.levels.INFO
  	}
  )
};
