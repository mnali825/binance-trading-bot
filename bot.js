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

    times.push(eventTime);
    opens.push(open);
    closes.push(close);
    highs.push(high);
    lows.push(low);
    volumes.push(volume);

    // Technical analysis

    var oneDay = getCandleSticks(opens,highs,closes,lows,1);
    var twoDay = getCandleSticks(opens,highs,closes,lows,2);
    var threeDay = getCandleSticks(opens,highs,closes,lows,3);

    var bullishEngulfing = TI.bullishengulfingpattern(twoDay);
    var doji = TI.doji(oneDay);
    var dragonflyDoji = TI.dragonflydoji(oneDay);
    var bullishHarami = TI.bullishharami(twoDay);
    var bullishHaramiCross = TI.bullishharamicross(twoDay);
    var bullishMarubozu = TI.bullishmarubozu(getCandleSticks(closes,opens,highs,lows,1));
    var bullishSpinningTop = TI.bullishspinningtop(oneDay);
    var threeWhiteSoldiers = TI.threewhitesoldiers(threeDay);

    var bearishEngulfing = TI.bearishengulfingpattern(twoDay);
    var bearishHaramiCross = TI.bearishharamicross(twoDay);
    var bearishMarubozu = TI.bearishmarubozu(getCandleSticks(closes,opens,highs,lows,1));
    var bearishSpinningTop = TI.bearishspinningtop(oneDay);

    var threeBlackCrows = TI.threeblackcrows(threeDay);
    var gravestoneDoji = TI.gravestonedoji(oneDay);
    var darkCloudCover = TI.darkcloudcover(twoDay);
    var piercing = TI.piercingline(twoDay);
    var eveningStar = TI.eveningstar(threeDay);
    var morningStar = TI.morningstar(threeDay);

    // var bullish = TI.bullish(twoDay);
    // var bearish = TI.bearish(twoDay);
    
    
    

    // console.log(times);
    console.log(bullishEngulfing, doji, gravestoneDoji, dragonflyDoji, bearishEngulfing, bullishHarami, bullishHaramiCross, bearishHaramiCross, bullishMarubozu, bullishSpinningTop, bearishMarubozu, bearishSpinningTop, darkCloudCover, piercing, eveningStar, morningStar, threeBlackCrows, threeWhiteSoldiers);
  });

}, {limit:3});

function getCandleSticks(o,h,c,l, n) {
  return {
      open: o.slice(-n),
      high: h.slice(-n),
      close: c.slice(-n),
      low: l.slice(-n)
    }
}
