const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

exports.exchangeWs = function (data) {
    lastupdateWs.clients.forEach(function (client) {
      client.send(JSON.stringify(data));
    });
};

var exchanges = require('./exchanges/main');
var expressWs = require('express-ws')
expressWs = expressWs(express());

var app = expressWs.app;

app.ws('/exchangeWs', function (ws, req) {});
lastupdateWs = expressWs.getWss('/exchangeWs');

// Load routes
const stream = require('./routes/stream').router;

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.redirect('/stream/index');
});

app.get('', (req, res) => {
    res.redirect('/stream/index');
  });

app.use('/stream', stream);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  exchanges.init();
});

