const binance = require('node-binance-api');
binance.options({
  'APIKEY':'AZNp6h9Kaoeukj8b9uZgwVZuRf4n0AXLjrwA9gKbg0JGog4ECrk5yaCNmFsldnNQ',
  'APISECRET':'uQp8M62dDDylqBvAwvqfNVIgsScOZEXnp4lnxZ0wF2WoamQt2eLQgvMfbVEIchhc'
});

var TI = require('technicalindicators');

var coin = 'BNBUSDT';
var amount = 100;

var startingValue = 10000;
var balanceUSD = 10000;
var balanceCoin = 0;

var lastBuyPrice = 0;
var lastSellPrice = 0;

var buyPrices = [];

var totalTrades = 0;
var feesPaid = 0;

function buy(ticker, amount, price) {
  lastBuyPrice = price;
  buyPrices.push(price);
  
  var feeCoin = amount*0.0005;
  var feeUSD = amount*price*0.0005;

  balanceUSD -= amount*price;
  balanceUSD -= feeUSD;

  balanceCoin += (amount-feeCoin);

  totalTrades += 1;
  feesPaid += amount*price*0.0005;
}

function sell(ticker, amount, price) {

  lastSellPrice = price;

  var feeCoin = amount*0.0005;
  var feeUSD = amount*price*0.0005

  balanceUSD += amount*price;
  balanceUSD += feeUSD;

  balanceCoin -= (amount+feeCoin);

  totalTrades += 1;
  feesPaid += amount*price*0.0005;
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