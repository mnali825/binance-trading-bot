const binance = require('node-binance-api');
binance.options({
  'APIKEY':'AZNp6h9Kaoeukj8b9uZgwVZuRf4n0AXLjrwA9gKbg0JGog4ECrk5yaCNmFsldnNQ',
  'APISECRET':'uQp8M62dDDylqBvAwvqfNVIgsScOZEXnp4lnxZ0wF2WoamQt2eLQgvMfbVEIchhc'
});

var BB = require('technicalindicators').BollingerBands

var balance = 10000;
var portfolio = [];
var buys = 0;
var sells = 0;

function buy(ticker, amount, price) {
  portfolio[ticker] ? portfolio[ticker] += amount : portfolio[ticker] = amount;
  balance -= amount*price;
}

function sell(ticker, amount, price) {
  portfolio[ticker] ? (portfolio[ticker] -= amount,balance += amount*price) : console.log("hmm.. doesn't look like you have any "+ticker);
}

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks("BTCUSDT", "1m", function(err, ticks, symbol) {
  if (err) {
    console.log('ERROR:'+err);
    process.exit();
  }

  var closes = [];

  ticks.forEach(function(tick) {
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
    closes.push(Number(close));
  });

  // console.log('closes:',closes);

  var input = {
    period:20,
    values:closes,
    stdDev:2
  }

  // console.log(input);

  var bands = BB.calculate(input);  

  binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    input.values.shift();
    input.values.push(Number(close));

    var bands = BB.calculate(input);

    var lastBand = bands[bands.length-1];
    // Bandwidth indicates volatility
    var bandwidth = (lastBand.upper-lastBand.lower)/lastBand.middle;

    // %B is derived from the formula for stochastics and shows where price is in relation to the bands. 
    // %B Above 1 = Price is Above the Upper Band
    // %B Equal to 1 = Price is at the Upper Band
    // %B Above .50 = Price is Above the Middle Line
    // %B Below .50 = Price is Below the Middle Line
    // %B Equal to 0 = Price is at the Lower Band
    // %B Below 0 = Price is Below the Lower Band
    if (lastBand.pb <= 0.25) {
      
    } else if (lastBand.pb >= 0.75) {

    }
  });

}, {limit:500});


