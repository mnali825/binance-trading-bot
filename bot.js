const binance = require('node-binance-api');
binance.options({
  'APIKEY':'AZNp6h9Kaoeukj8b9uZgwVZuRf4n0AXLjrwA9gKbg0JGog4ECrk5yaCNmFsldnNQ',
  'APISECRET':'uQp8M62dDDylqBvAwvqfNVIgsScOZEXnp4lnxZ0wF2WoamQt2eLQgvMfbVEIchhc'
});

// const TI = require('technicalindicators');
// TI.setConfig('precision', 10);

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
binance.candlesticks("BTCUSDT", "2h", (err, ticks, symbol) => {
  var times = [];
  var opens = [];
  var closes = [];
  var highs = [];
  var lows = [];
  var volumes = [];

  // Add initial candlesticks
  ticks.forEach(function(tick) {
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
    times.push(time);
    opens.push(open);
    closes.push(close);
    highs.push(high);
    lows.push(low);
    volumes.push(volume);
  });

  // Get most recent candlestick and run analysis on current dataset
  binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;

    times.push(time);
    opens.push(open);
    closes.push(close);
    highs.push(high);
    lows.push(low);
    volumes.push(volume);

    // Technical analysis
    
  });

}, {limit:3});
