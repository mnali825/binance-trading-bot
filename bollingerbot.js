const binance = require('node-binance-api');
binance.options({
  'APIKEY':'AZNp6h9Kaoeukj8b9uZgwVZuRf4n0AXLjrwA9gKbg0JGog4ECrk5yaCNmFsldnNQ',
  'APISECRET':'uQp8M62dDDylqBvAwvqfNVIgsScOZEXnp4lnxZ0wF2WoamQt2eLQgvMfbVEIchhc'
});

var BB = require('technicalindicators').BollingerBands

var coin = 'BNBUSDT';
var totalTrades = 0;

var startingValue = 10000;
var balanceUSD = 10000;
var balanceCoin = 0;

var lastBuyPrice = 0;
var lastSellPrice = 0;

var amount = 100;

var feesPaid = 0;

function buy(ticker, amount, price) {
  lastBuyPrice = price;
  var feeCoin = amount*0.0005;
  var feeUSD = amount*price*0.0005;

  balanceUSD -= amount*price;
  balanceUSD -= feeUSD;

  balanceCoin += (amount-feeCoin);

  totalTrades += 1;
  feesPaid += amount*price*0.0005;
}

function sell(ticker, amount, price) {
  // if more than have your portfolio is invested, sell 25% more
  lastSellPrice = price;

  var feeCoin = amount*0.0005;
  var feeUSD = amount*price*0.0005

  if (amount*price > 0.5*startingValue) {
    amount *= 1.25;
  }

  balanceUSD += amount*price;
  balanceUSD += feeUSD;

  balanceCoin -= (amount+feeCoin);

  totalTrades += 1;
  feesPaid += amount*price*0.0005;
}

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks(coin, "1m", function(err, ticks, symbol) {
  console.log('got initial candlesticks for: ', symbol);
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

  binance.websockets.candlesticks([coin], "1m", (candlesticks) => {

    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    
    var date = new Date(eventTime);
    console.log(date);

    input.values.shift();
    input.values.push(Number(close));

    var bands = BB.calculate(input);

    var lastBand = bands[bands.length-1];
    // Bandwidth indicates volatility
    var bandwidth = (lastBand.upper-lastBand.lower)/lastBand.middle*100;

    // %B is derived from the formula for stochastics and shows where price is in relation to the bands. 
    // %B Above 1 = Price is Above the Upper Band
    // %B Equal to 1 = Price is at the Upper Band
    // %B Above .50 = Price is Above the Middle Line
    // %B Below .50 = Price is Below the Middle Line
    // %B Equal to 0 = Price is at the Lower Band
    // %B Below 0 = Price is Below the Lower Band

    console.log("account value: "+(balanceUSD+(balanceCoin*close)));
    console.log("balance ($): ",balanceUSD);
    console.log("balance "+coin+": ",balanceCoin);
    console.log("current %B : ",lastBand.pb);
    console.log("bandwidth : ", bandwidth);
    console.log("total trades : ", totalTrades);
    console.log("total fees paid : ", feesPaid);
    console.log("=========================================");

    if (bandwidth >= 0.15) {

      // check if 30 seconds has past since last buy

      if (lastBand.pb <= 0.05 && balanceUSD >= (amount*close)) {
        buy(coin, amount, close);
        buys=0;
      }

      // check if 30 seconds has passed since last sell
      if (lastBand.pb >= 0.95 && balanceCoin >= amount) {
        // only sell if it is in the top 20% of bollinger band && you have enough money
        sell(coin, amount, close);
        sells=0;
      } 

    }

  });

}, {limit:20});


