const WebSocket = require('ws');
var exchangeWs = require("../app").exchangeWs;
var pako = require('pako');

var self = this;

self.init = startWebsocket;

async function startWebsocket() {
    const url = 'wss://push.bibox.com/'
    const connection = new WebSocket(url);
    connection.onerror = error => {
        console.log(`WebSocket error: ${error}`)
    }
    connection.onopen = () => {
        ""
        var ticker = {
            "event": "addChannel",
            "channel": "bibox_sub_spot_BTC_USDT_deals",
            "binary": 1
        }

        connection.send(JSON.stringify(ticker));
    }
    connection.onmessage = e => {

        var array = JSON.parse(e.data);

        if (array == undefined)
            return;

        for (let index = 0; index < array.length; index++) {
            const data = array[index];

            if (data.data_type == 0)
                return;

            var trades = JSON.parse(pako.inflate(Buffer.from(data.data, 'base64'), {
                to: 'string'
            }));

            trades.forEach(trade => {
                console.log(trade);

                exchangeWs({
                    exchange: "bibox",
                    timestamp: new Date(trade.time),
                    price: trade.price,
                    quantity: trade.amount,
                    side: trade.side == 1 ? "buy" : "sell" // 1 buy 2 sell
                });
            });
        }
    }

    connection.onclose = e => {
        startWebsocket();
    }
}

module.exports = self;