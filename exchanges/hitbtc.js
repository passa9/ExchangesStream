const WebSocket = require('ws');
var exchangeWs = require("./../index").exchangeWs;

var connection;
const url = 'wss://api.hitbtc.com/api/2/ws'

var self = this;

self.init = startWebsocket;

async function startWebsocket() {

    connection = new WebSocket(url);
    connection.onerror = error => {
        console.log(`WebSocket error: ${error}`)
    }
    connection.onopen = () => {
        var symbol = "BTCUSD";
        //var symbol = "ADABTC";
        var ticker = {
            method: "subscribeTrades",
            params: {
                symbol: symbol
            },
            limit: 1,
            id: 123
        }

        connection.send(JSON.stringify(ticker));
    }
    connection.onmessage = e => {
        console.log(e.data);
        var json = JSON.parse(e.data);
        if (json.method != "updateTrades")
            return;

        var trades = json.params.data;

        trades.forEach(trade => {
            exchangeWs({
                exchange: "hitbtc",
                timestamp: trade.timestamp,
                price: trade.price,
                quantity: trade.quantity,
                side: trade.side
            });
        });
    }

    connection.onclose = e => {
        startWebsocket();
    }
}

module.exports = self;