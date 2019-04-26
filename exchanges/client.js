const WebSocket = require('ws');
var exchangeWs = require("./../index").exchangeWs;
var moment = require('moment');
var fs = require('fs');

var lastHitBTC;
var amountHitBTC = 0;

var lastBinance;
var amountBinance = 0;

var lastBibox;
var amountBibox = 0;

var trades = [];

var self = this;

self.init = async function () {
    const url = 'ws://localhost:5000/exchangeWs'
    const connection = new WebSocket(url);
    connection.onerror = error => {
        console.log(`WebSocket error: ${error}`)
    }
    connection.onopen = () => {
      //  updateExcel(getHeaderMessage());
        setInterval(() => {
          //  updateExcel(getMessage())
        }, 300); 
    }
    connection.onmessage = e => {
        var data = JSON.parse(e.data);

        if (data.exchange == "hitbtc") {
            lastHitBTC = data.price;
            amountHitBTC += parseFloat(data.quantity);
        } else if (data.exchange == "binance") {
            lastBinance = data.price;
            amountBinance += parseFloat(data.quantity);
        } else if (data.exchange == "bibox") {
            lastBibox = data.price;
            amountBibox += parseFloat(data.quantity);
        }
    }
}

function getMessage() {

    if (lastHitBTC == undefined || lastBinance == undefined || lastBibox == undefined) 
        return "";

    var message = moment(new Date()).utcOffset('+0200').format("DD-MM-YYYY HH:mm:ss:SS") + ";";//new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + new Date().get ";";
    message += lastHitBTC.toString().replace(".", ",") + ";";
    message += amountHitBTC.toString().replace(".", ",") + ";";
    message += lastBinance.toString().replace(".", ",") + ";";
    message += amountBinance.toString().replace(".", ",") + ";";
    message += lastBibox.toString().replace(".", ",") + ";";
    message += amountBibox.toString().replace(".", ",");

    amountHitBTC = 0;
    amountBibox = 0;
    amountBinance = 0;

    return message;
}

function getHeaderMessage() {
    return "TIMESTAMP" + ";" + "LAST HITBTC" + ";" + "AMOUNT HITBTC" + ";" + "LAST BINANCE" + ";" + "AMOUNT BINANCE" + ";" + "LAST BIBOX" + ";" + "AMOUNT BIBOX";
}

function updateExcel(message) {

    if (message == "")
        return;

    var momentDate = moment(new Date()).utcOffset('+0200');
    var path = './public/logs/exchanges/';
    var logFileName = momentDate.format('DD-MM-YYYY') + '.csv';
    path = path + logFileName;
    let logger = fs.createWriteStream(path, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    })

    logger.write(message + '\r\n');
    logger.end();
}

module.exports = self;