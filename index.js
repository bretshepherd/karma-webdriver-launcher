var fs = require('fs');
var wd = require('wd');

var WebDriverInstance = function (baseBrowserDecorator, args) {
  var config = args.config || {
    hostname: '127.0.0.1',
    port: 4444
  };

  var self = this;

  baseBrowserDecorator(this);

  this.name = args.browserName + ' via Remote WebDriver';


  this.kill = function(done) {
    if (!driver) {
      return process.nextTick(done);
    }

    clearTimeout(pendingHeartBeat);
    log.debug('Shutting down the %s driver', browserName);
    // workaround - navigate to other page to avoid re-connection
    driver.get('about:blank', function() {
      driver.quit(done);
    });
  };

  this._start = function (url) {
    self.browser = wd.remote(config);
    self.browser.init(args, function () {
      self.browser.get(url);
    });
  };
};

WebDriverInstance.prototype = {
  name: 'WebDriver',

  DEFAULT_CMD: {
    linux: require('wd').path,
    darwin: require('wd').path,
    win32: require('wd').path
  },
  ENV_CMD: 'WEBDRIVER_BIN'
};

WebDriverInstance.$inject = ['baseBrowserDecorator', 'args'];

// PUBLISH DI MODULE
module.exports = {
  'launcher:WebDriver': ['type', WebDriverInstance]
};
