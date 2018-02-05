const binance = require('node-binance-api');
binance.options({
  'APIKEY':'AZNp6h9Kaoeukj8b9uZgwVZuRf4n0AXLjrwA9gKbg0JGog4ECrk5yaCNmFsldnNQ',
  'APISECRET':'uQp8M62dDDylqBvAwvqfNVIgsScOZEXnp4lnxZ0wF2WoamQt2eLQgvMfbVEIchhc'
});

var async = require('async');

var TI = require('technicalindicators');

var coin = "BNBUSDT";
var balance = 10000;
var portfolio = [];

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
  var feeUSD = amount*price*0.0005;

  balanceUSD += amount*price;
  balanceUSD += feeUSD;

  balanceCoin -= (amount+feeCoin);

  totalTrades += 1;
  feesPaid += amount*price*0.0005;
}


var c1m = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c3m = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c5m = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c15m = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c30m = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c1h = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c2h = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c4h = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c6h = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c8h = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c12h = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
var c1d = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
// var c3d = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
// var c1w = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};
// var c1m = {'time':[], 'open':[], 'close':[], 'high':[], 'low':[], 'vol':[]};

var candlesticks = {"c1m":c1m,"c3m":c3m,"c5m":c5m,"c15m":c15m,"c30m":c30m,"c1h":c1h,"c2h":c2h,"c4h":c4h,"c6h":c6h,"c8h":c8h,"c12h":c12h,"c1d":c1d}

async.parallel({
  c1m:function(cb) {
    binance.candlesticks(coin, '1m', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c3m:function(cb) {
    binance.candlesticks(coin, '3m', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c5m:function(cb) {
    binance.candlesticks(coin, '5m', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c15m:function(cb) {
    binance.candlesticks(coin, '15m', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c30m:function(cb) {
    binance.candlesticks(coin, '30m', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c1h:function(cb) {
    binance.candlesticks(coin, '1h', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c2h:function(cb) {
    binance.candlesticks(coin, '2h', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c4h:function(cb) {
    binance.candlesticks(coin, '4h', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c6h:function(cb) {
    binance.candlesticks(coin, '6h', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c8h:function(cb) {
    binance.candlesticks(coin, '8h', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c12h:function(cb) {
    binance.candlesticks(coin, '12h', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  },
  c1d:function(cb) {
    binance.candlesticks(coin, '1d', (err, ticks, symbol) => {
      !err ? cb(null, ticks) : cb('error');
    });
  }
}, function(err, res) {

  for (key in res) {
    res[key].forEach(function(tick) {
      let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
      candlesticks[key].open.push(Number(open));
      candlesticks[key].close.push(Number(close));
      candlesticks[key].high.push(Number(high));
      candlesticks[key].low.push(Number(low));
      candlesticks[key].vol.push(Number(volume));
      candlesticks[key].time.push(new Date(time));
    });
  }

  // console.log(candlesticks.c1m);

  // Get most recent candlestick and run analysis on current dataset
  binance.websockets.candlesticks(['BNBBTC'], "1m", (data) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = data;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;

    var time = new Date(eventTime);

    var times = candlesticks['c1m'].time;

    if (time.getMinutes() == times[times.length-1].getMinutes()) {
      for (key in candlesticks) {
        candlesticks[key].time[times.length-1] = time;
        candlesticks[key].open[times.length-1] = open;
        candlesticks[key].close[times.length-1] = close;
        candlesticks[key].high[times.length-1] = high;
        candlesticks[key].low[times.length-1] = low;
        candlesticks[key].vol[times.length-1] = volume;
      }
    } else {

      candlesticks['c1m'].time.shift();
      candlesticks['c1m'].open.shift();
      candlesticks['c1m'].close.shift();
      candlesticks['c1m'].high.shift();
      candlesticks['c1m'].low.shift();
      candlesticks['c1m'].vol.shift();

      candlesticks['c1m'].time.push(time);
      candlesticks['c1m'].open.push(open);
      candlesticks['c1m'].close.push(close);
      candlesticks['c1m'].high.push(high);
      candlesticks['c1m'].low.push(low);
      candlesticks['c1m'].vol.push(volume);
    }

    for (key in candlesticks) {
      var o = candlesticks[key].open;
      var c = candlesticks[key].close;
      var h = candlesticks[key].high;
      var l = candlesticks[key].low;

      var oneDay = getCandleSticks(o,h,c,l,1);
      var twoDay = getCandleSticks(o,h,c,l,2);
      var threeDay = getCandleSticks(o,h,c,l,3);

        // Bullish
      var bullishEngulfing = TI.bullishengulfingpattern(twoDay);
      var dragonflyDoji = TI.dragonflydoji(oneDay);
      var bullishHarami = TI.bullishharami(twoDay);
      var bullishHaramiCross = TI.bullishharamicross(twoDay);
      var bullishMarubozu = TI.bullishmarubozu(getCandleSticks(c,o,h,l,1));
      var bullishSpinningTop = TI.bullishspinningtop(oneDay);
      var threeWhiteSoldiers = TI.threewhitesoldiers(threeDay);
      var morningStar = TI.morningstar(threeDay);
      var piercing = TI.piercingline(twoDay);

      // Reversal
      var doji = TI.doji(oneDay);

      // Bearish
      var bearishEngulfing = TI.bearishengulfingpattern(twoDay);
      var bearishHaramiCross = TI.bearishharamicross(twoDay);
      var bearishMarubozu = TI.bearishmarubozu(getCandleSticks(c,o,h,l,1));
      var bearishSpinningTop = TI.bearishspinningtop(oneDay);
      var threeBlackCrows = TI.threeblackcrows(threeDay);
      var gravestoneDoji = TI.gravestonedoji(oneDay);
      var darkCloudCover = TI.darkcloudcover(twoDay);
      var eveningStar = TI.eveningstar(threeDay); 

      var bullishIndicators = [bullishEngulfing,dragonflyDoji,bullishHarami,bullishHaramiCross,bullishMarubozu,bullishSpinningTop,threeWhiteSoldiers,morningStar,piercing];
      var bullishWeight = [1,2,1,1,1,1,3,1,1];

      var bearishIndicators = [bearishEngulfing,bearishHaramiCross,bearishMarubozu,bearishSpinningTop,threeBlackCrows,gravestoneDoji,darkCloudCover,eveningStar];
      var bearishWeights = [1,1,1,1,3,2,1,1];

      console.log(bullishIndicators);
      console.log(bearishIndicators);
    }
    
    // CANDLESTICK INDICATORS

    // bullishIndicators.forEach(function(ind, i) {
    //   if (ind) {
    //     aggregate+=bullishWeight[i];
    //   }
    // });

    // bearishInidicators.forEach(function(ind, i) {
    //   if (ind) {
    //     aggregate-=bearishWeights[i];
    //   }
    // });

    // console.log(aggregate);
    // console.log(bullishEngulfing, doji, gravestoneDoji, dragonflyDoji, bearishEngulfing, bullishHarami, bullishHaramiCross, bearishHaramiCross, bullishMarubozu, bullishSpinningTop, bearishMarubozu, bearishSpinningTop, darkCloudCover, piercing, eveningStar, morningStar, threeBlackCrows, threeWhiteSoldiers);
  });
})

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
// binance.candlesticks("BTCUSDT", "15m", (err, ticks, symbol) => {
//   var times = [];
//   var opens = [];
//   var closes = [];
//   var highs = [];
//   var lows = [];
//   var vols = [];

//   // Add initial candlesticks
//   ticks.forEach(function(tick) {
//     let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = tick;
//     var time = new Date(time)
//     times.push(time);
//     opens.push(open);
//     closes.push(close);
//     highs.push(high);
//     lows.push(low);
//     vols.push(volume);
//   });

//   // Get most recent candlestick and run analysis on current dataset
//   binance.websockets.candlesticks(['BNBBTC'], "1m", (candlesticks) => {
//     let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
//     let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;


//     var time = new Date(eventTime);

//     if (time.getMinutes() == times[times.length-1].getMinutes()) {
      
//       times[times.length-1] = time;
//       opens[times.length-1] = time;
//       closes[times.length-1] = time;
//       highs[times.length-1] = time;
//       lows[times.length-1] = time;
//       vols[times.length-1] = time;

//     } else {

//       times.shift();
//       opens.shift();
//       closes.shift();
//       highs.shift();
//       lows.shift();
//       vols.shift();

//       times.push(time);
//       opens.push(open);
//       closes.push(close);
//       highs.push(high);
//       lows.push(low);
//       vols.push(volume);  
//     }

    

//     // CANDLESTICK INDICATORS

//     var oneDay = getCandleSticks(opens,highs,closes,lows,1);
//     var twoDay = getCandleSticks(opens,highs,closes,lows,2);
//     var threeDay = getCandleSticks(opens,highs,closes,lows,3);

//     // Bullish
//     var bullishEngulfing = TI.bullishengulfingpattern(twoDay);
//     var dragonflyDoji = TI.dragonflydoji(oneDay);
//     var bullishHarami = TI.bullishharami(twoDay);
//     var bullishHaramiCross = TI.bullishharamicross(twoDay);
//     var bullishMarubozu = TI.bullishmarubozu(getCandleSticks(closes,opens,highs,lows,1));
//     var bullishSpinningTop = TI.bullishspinningtop(oneDay);
//     var threeWhiteSoldiers = TI.threewhitesoldiers(threeDay);
//     var morningStar = TI.morningstar(threeDay);
//     var piercing = TI.piercingline(twoDay);

//     // Reversal
//     var doji = TI.doji(oneDay);

//     // Bearish
//     var bearishEngulfing = TI.bearishengulfingpattern(twoDay);
//     var bearishHaramiCross = TI.bearishharamicross(twoDay);
//     var bearishMarubozu = TI.bearishmarubozu(getCandleSticks(closes,opens,highs,lows,1));
//     var bearishSpinningTop = TI.bearishspinningtop(oneDay);
//     var threeBlackCrows = TI.threeblackcrows(threeDay);
//     var gravestoneDoji = TI.gravestonedoji(oneDay);
//     var darkCloudCover = TI.darkcloudcover(twoDay);
//     var eveningStar = TI.eveningstar(threeDay);

//     // Create array for indicator flag, and indicator weight
//     var bullishIndicators = [bullishEngulfing,dragonflyDoji,bullishHarami,bullishHaramiCross,bullishMarubozu,bullishSpinningTop,threeWhiteSoldiers,morningStar,piercing];
//     var bullishWeight = [1,2,1,1,1,1,3,1,1];

//     var bearishInidicators = [bearishEngulfing,bearishHaramiCross,bearishMarubozu,bearishSpinningTop,threeBlackCrows,gravestoneDoji,darkCloudCover,eveningStar];
//     var bearishWeights = [1,1,1,1,3,2,1,1];

//     bullishIndicators.forEach(function(ind, i) {
//       if (ind) {
//         aggregate+=bullishWeight[i];
//       }
//     });

//     bearishInidicators.forEach(function(ind, i) {
//       if (ind) {
//         aggregate-=bearishWeights[i];
//       }
//     });

//     console.log(aggregate);
//     // console.log(bullishEngulfing, doji, gravestoneDoji, dragonflyDoji, bearishEngulfing, bullishHarami, bullishHaramiCross, bearishHaramiCross, bullishMarubozu, bullishSpinningTop, bearishMarubozu, bearishSpinningTop, darkCloudCover, piercing, eveningStar, morningStar, threeBlackCrows, threeWhiteSoldiers);
//   });

// }, {limit:20});

function getCandleSticks(o,h,c,l, n) {
  return {
      open: o.slice(-n),
      high: h.slice(-n),
      close: c.slice(-n),
      low: l.slice(-n)
    }
}
