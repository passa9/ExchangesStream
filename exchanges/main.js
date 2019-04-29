var wsHitBTC = require("./hitbtc");
var wsBinance = require("./binance");
var wsBibox = require("./bibox");
var wsBitmex = require("./bitmex");
var wsClient = require("./client");

var self = this;

self.init = function () {
    wsHitBTC.init();
    wsBinance.init();
    wsBibox.init();
    wsBitmex.init();

    wsClient.init();
}

module.exports = self;