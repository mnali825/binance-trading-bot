const binance = require('node-binance-api');
binance.options({
  'APIKEY':'AZNp6h9Kaoeukj8b9uZgwVZuRf4n0AXLjrwA9gKbg0JGog4ECrk5yaCNmFsldnNQ',
  'APISECRET':'uQp8M62dDDylqBvAwvqfNVIgsScOZEXnp4lnxZ0wF2WoamQt2eLQgvMfbVEIchhc'
});

var TI = require('technicalindicators');

var balance = 10000;
var portfolio = [];

function buy(ticker, amount, price) {
  portfolio[ticker] ? portfolio[ticker] += amount : portfolio[ticker] = amount;
  balance -= amount*price;
}

function sell(ticker, amount, price) {
  portfolio[ticker] ? (portfolio[ticker] -= amount,balance += amount*price) : console.log("hmm.. doesn't look like you have any "+ticker);
}

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks("BTCUSDT", "5m", function(err, ticks, symbol) {
  console.log(err);
  // var times = [];
  // var opens = [];
  // var closes = [];
  // var highs = [];
  // var lows = [];
  // var vols = [];

  // Add initial candlesticks
  ticks.forEach(function(tick) {
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;

  });




});