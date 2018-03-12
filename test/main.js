const path = require('path');
require('chromedriver');
const webdriver = require('selenium-webdriver');
const Capabilities = require('selenium-webdriver/lib/capabilities').Capabilities;
const logging = require('selenium-webdriver/lib/logging');

const express = require('express');

var server = null;

function startServer() {
  console.log('start server');
  app = express();
  app.use(express.static(__dirname + '/../public/'));
  return new Promise((resolve) => {
    server = app.listen(8080, resolve);
  }).then(() => console.log('server started'));
}

function shutdownServer() {
  console.log('shutdown');
  driver.close();
  server.close();
}

const capabilities = Capabilities.chrome()
capabilities.set('chromeOptions', {
  args: [`--load-extension=${path.resolve('extension/')}`]
})
const prefs = new logging.Preferences();
prefs.setLevel(logging.Type.DRIVER, logging.Level.DEBUG);
capabilities.setLoggingPrefs(prefs);

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .withCapabilities(capabilities)
  .build();

function switchToFrame(id) {
  return driver.findElement({ id }).then((element) => {
    console.log('found element', id);
    return driver.switchTo().frame(element)
      .then(() => console.log('switch done:', id))
      .catch(e => console.error('switch error:', e.message))
      .then(typeSomething)
      .then(() => driver.switchTo().defaultContent());
  }).catch((e) => console.error('could not find element', id));
}

function typeSomething() {
  return driver.findElement({ css: 'input' }).then((element) => {
    element.sendKeys('I was here');
  })
}

function retrieveLogs() {
  driver.manage().logs().get(logging.Type.DRIVER).then((entries) => {
    entries.forEach(function(entry) {
      console.log('[%s] %s', entry.level.name, entry.message);
    });
  });
}

startServer()
  .then(() => driver.get('http://localhost:8080/index.html'))
  .then(typeSomething)
  .then(() => switchToFrame('normalSrc'))
  .then(() => switchToFrame('extensionSrc'))
  .then(retrieveLogs);
  //.then(typeSomething);
  //.then(shutdownServer);
