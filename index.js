var config = require('./config');
var Log = require('log'), log = new Log(config.log.level);
var mqtt = require('mqtt');
var TelegramBot = require('node-telegram-bot-api');

var telegramBot = new TelegramBot(config.telegram.token, {polling: true});
var mqtt = mqtt.connect(config.mqtt);
var fromId = false;

mqtt.on('error', function (error) {
    log.error(error);
});

mqtt.on('connect', function () {
    log.info('Connected to mqtt broker!')
    mqtt.subscribe(config.mqtt.subscription);
});

mqtt.on('message', function (topic, message) {
    var payload = message.toString();
    if (fromId) {
      console.log("Sending Message..." + fromId);
      console.log(message);
      telegramBot.sendMessage(fromId, payload);
  }
});

// Matches /echo [whatever]
telegramBot.on('message', function (msg) {
   fromId = msg.chat.id;
   telegramBot.sendMessage(fromId, 'Echo: ' + msg.text);
});
