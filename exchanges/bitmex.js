const WebSocket = require('ws');
var exchangeWs = require("../app").exchangeWs;

var self = this;

const url = 'wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD'
var connection;

self.init = startWebsocket

async function startWebsocket() {

    /*    const url = 'wss://stream.binance.com:9443/ws/adabtc@trade' */
    connection = new WebSocket(url);
    connection.onerror = error => {
        console.log(`WebSocket error: ${error}`)
    }
    connection.onopen = () => {
        console.log("gone");
    }
    connection.onmessage = e => {

        var data = JSON.parse(e.data);

        if (data.data == undefined)
            return;

        var trades = data.data;

        trades.forEach(trade => {
            console.log(trade)
            exchangeWs({
                exchange: "bitmex",
                timestamp: new Date(trade.timestamp),
                price: trade.price + 90,
                quantity: trade.size,
                side: trade.side == "Sell" ? "sell" : "buy"
            });
        });
    }

    connection.onclose = e => {
        startWebsocket();
    }

}

module.exports = self;