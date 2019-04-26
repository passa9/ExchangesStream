const WebSocket = require('ws');
var exchangeWs = require("./../index").exchangeWs;
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
        /*      var ticker = {
                 "event": "addChannel",
                 "channel": "bibox_sub_spot_ADA_BTC_deals",
                 "binary": 1
             } */

        connection.send(JSON.stringify(ticker));
    }
    connection.onmessage = e => {
        //  console.log(e.data) //binary: "1"
        //  channel: "bibox_sub_spot_BTC_USDT_deals"
        //  data: "H4sIAAAAAAAA/xTLOw6CQBAG4Lv89YQwr8WdUr2BWBljiFBMgRLEynh34wG+ywfLkCsC+/5wO5+OPQhbzhOC3a21umN3dcKy5n1CwLiVplYQhvn5fmwISKNsRaRTEF45/jEhR4QU65iL6/f6CwAA//+92vqLagAAAA=="
        //  data_type: 1

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
                    side: trade.side == 1 ? "buy" : "sell"
                });
            });
        }
    }

    connection.onclose = e => {
        startWebsocket();
    }
}

module.exports = self;