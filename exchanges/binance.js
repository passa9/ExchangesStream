const WebSocket = require('ws');
var exchangeWs = require("./../index").exchangeWs;

var self = this;

const url = 'wss://stream.binance.com:9443/ws/btcusdt@trade'
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
        console.log(e.data)
        var trade = JSON.parse(e.data);
        exchangeWs({
            exchange: "binance",
            timestamp: new Date(trade.T),
            price: trade.p,
            quantity: trade.q,
            side: trade.m ? "sell" : "buy"
        });
    }

    connection.onclose = e => {
        startWebsocket();
    }

}

module.exports = self;