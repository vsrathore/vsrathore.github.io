function stdNormCDF(x){
  var probability = 0;
  if(x >= 8)
  { probability = 1; }
  else if(x <= -8)
  { probability = 0; }
  else
  {
    for(var i = 0; i < 100; i++)
    { probability += (Math.pow(x, 2*i+1)/_doubleFactorial(2*i+1)); }
    probability *= Math.pow(Math.E, -0.5*Math.pow(x, 2));
    probability /= Math.sqrt(2*Math.PI);
    probability += 0.5;
  }
  return probability;
}


function _doubleFactorial(n){
  var val = 1;
  for(var i = n; i > 1; i-=2)
  { val *= i; }
  return val;
}

/**
 * Black-Scholes option pricing formula.
 * See {@link http://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model#Black-Scholes_formula|Wikipedia page}
 * for pricing puts in addition to calls.
 *
 * @param   {Number} s       Current price of the underlying
 * @param   {Number} k       Strike price
 * @param   {Number} t       Time to experiation in years
 * @param   {Number} v       Volatility as a decimal
 * @param   {Number} r       Anual risk-free interest rate as a decimal
 * @param   {String} callPut The type of option to be priced - "call" or "put"
 * @returns {Number}         Price of the option
 */
function blackScholes(s, k, t, v, r, callPut){
  var price = null;
  var w = (r * t + Math.pow(v, 2) * t / 2 - Math.log(k / s)) / (v * Math.sqrt(t));
  if(callPut === "call")
  { price = s * stdNormCDF(w) - k * Math.pow(Math.E, -1 * r * t) * stdNormCDF(w - v * Math.sqrt(t)); }
  else // put
  { price = k * Math.pow(Math.E, -1 * r * t) * stdNormCDF(v * Math.sqrt(t) - w) - s * stdNormCDF(-w); }
  return price;
}

/**
 * Calcuate omega as defined in the Black-Scholes formula.
 *
 * @param   {Number} s Current price of the underlying
 * @param   {Number} k Strike price
 * @param   {Number} t Time to experiation in years
 * @param   {Number} v Volatility as a decimal
 * @param   {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The value of omega
 */
function getW(s, k, t, v, r){
  return (r * t + Math.pow(v, 2) * t / 2 - Math.log(k / s)) / (v * Math.sqrt(t));
}














function _stdNormDensity(x)
{ return Math.pow(Math.E, -1 * Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI); }


/**
 * Calculates the delta of an option.
 *
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @param {String} callPut The type of option - "call" or "put"
 * @returns {Number} The delta of the option
 */
function getDelta(s, k, t, v, r, callPut){
  return callPut === "call"? _callDelta(s, k, t, v, r) : _putDelta(s, k, t, v, r)
}

/**
 * Calculates the delta of a call option.
 *
 * @private
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The delta of the call option
 */
function _callDelta(s, k, t, v, r){
  var w = getW(s, k, t, v, r);
  var delta = null;
  if(!isFinite(w)){ delta = (s > k) ? 1 : 0; }
  else { delta = stdNormCDF(w); }
  return delta;
}

/**
 * Calculates the delta of a put option.
 *
 * @private
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The delta of the put option
 */
function _putDelta(s, k, t, v, r){
  var delta = _callDelta(s, k, t, v, r) - 1;
  return (delta == -1 && k == s) ? 0 : delta;
}

/**
 * Calculates the rho of an option.
 *
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @param {String} callPut The type of option - "call" or "put"
 * @param {String} [scale=100] The value to scale rho by (100=100BPS=1%, 10000=1BPS=.01%)
 * @returns {Number} The rho of the option
 */
function getRho(s, k, t, v, r, callPut, scale) {
  scale = scale || 100;
  if(callPut === "call") { return _callRho(s, k, t, v, r) / scale; }
  else // put
  { return _putRho(s, k, t, v, r) / scale; }
}

/**
 * Calculates the rho of a call option.
 *
 * @private
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The rho of the call option
 */
function _callRho(s, k, t, v, r){
  var w = getW(s, k, t, v, r);
  return !isNaN(w) ? k * t * Math.pow(Math.E, -1 * r * t) * stdNormCDF(w - v * Math.sqrt(t)) : 0
}

/**
 * Calculates the rho of a put option.
 *
 * @private
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The rho of the put option
 */
function _putRho(s, k, t, v, r){
  var w = getW(s, k, t, v, r);
  return !isNaN(w) ? -1 * k * t * Math.pow(Math.E, -1 * r * t) * stdNormCDF(v * Math.sqrt(t) - w) : 0
}

/**
 * Calculates the vega of a call and put option.
 *
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The vega of the option
 */
function getVega(s, k, t, v, r)
{
  var w = getW(s, k, t, v, r);
  return (isFinite(w)) ? (s * Math.sqrt(t) * _stdNormDensity(w) / 100) : 0;
}

/**
 * Calculates the theta of an option.
 *
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @param {String} callPut The type of option - "call" or "put"
 * @param {String} [scale=365] The number of days to scale theta by - usually 365 or 252
 * @returns {Number} The theta of the option
 */
function getTheta(s, k, t, v, r, callPut, scale){
  scale = scale || 365;
  return callPut === "call" ? _callTheta(s, k, t, v, r) / scale : _putTheta(s, k, t, v, r) / scale
}

/**
 * Calculates the theta of a call option.
 *
 * @private
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The theta of the call option
 */
function _callTheta(s, k, t, v, r)
{
  var w = getW(s, k, t, v, r);
  if(isFinite(w))
  {
    return -1 * v * s * _stdNormDensity(w) / (2 * Math.sqrt(t)) - k * r * Math.pow(Math.E, -1 * r * t) * stdNormCDF(w - v * Math.sqrt(t));
  }
  else
  {
    return 0;
  }
}

/**
 * Calculates the theta of a put option.
 *
 * @private
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The theta of the put option
 */
function _putTheta(s, k, t, v, r)
{
  var w = getW(s, k, t, v, r);
  if(isFinite(w))
  {
    return -1 * v * s * _stdNormDensity(w) / (2 * Math.sqrt(t)) + k * r * Math.pow(Math.E, -1 * r * t) * stdNormCDF(v * Math.sqrt(t) - w);
  }
  else
  {
    return 0;
  }
}

/**
 * Calculates the gamma of a call and put option.
 *
 * @param {Number} s Current price of the underlying
 * @param {Number} k Strike price
 * @param {Number} t Time to experiation in years
 * @param {Number} v Volatility as a decimal
 * @param {Number} r Anual risk-free interest rate as a decimal
 * @returns {Number} The gamma of the option
 */
function getGamma(s, k, t, v, r)
{
  var w = getW(s, k, t, v, r);
  return (isFinite(w)) ? (_stdNormDensity(w) / (s * v * Math.sqrt(t))) : 0;
}







/*
* @param {Number} s Current price of the underlying
* @param {Number} k Strike price
* @param {Number} t Time to experiation in years
* @param {Number} optval MarketPrice of option
* @default {Number} r Anual risk-free interest rate as a decimal => 0 by default
* @default {Number} v Volatility as a decimal => 50% by default

*/

function getIV(s, k, t, optval,callPut){
  var delta_x = 0.001
  var epsilon = 0.00001
  var cur_x = 0.5
  var otype = callPut==="call" ? "call" : "put"

  for (var i = 0; i < 1500; i++) {
    var pp = blackScholes(s, k, t,cur_x,0,otype)
    fx = optval - pp
    cur_x_delta = cur_x - delta_x
    var pp_delta = blackScholes(s, k, t,cur_x_delta,0,otype)
    fx_delta = optval - pp_delta
    dx = (fx - fx_delta) / delta_x
    // console.log(i,optval,pp,pp_delta,fx,fx_delta,dx,Math.abs(dx) < epsilon,cur_x);
    if(Math.abs(dx) < epsilon){
      console.log('breaking');
      break;
    }else{
      cur_x = cur_x - (fx / dx)
      // cur_x = cur_x - (fx / dx)<0 ? 0 : cur_x - (fx / dx)   //bcoz volatility can't be negative
    }

    // console.log(i,cur_x);
  }
  return cur_x;
}





function showGreek(s,k,t,optval,callPut) {
  // console.log(s, k, t, optval,callPut);
  var v = getIV(s, k, t, optval,callPut)
  var greek = {call:{},put:{}}
  greek.volatility = v
  greek.input = {params:'s,k,t,optval,callPut',s_underlying:s, k_strike:k, t_time:t, optval_opPrice:optval,callPut:callPut}
  greek.callPut = callPut==="call" ? "call" : "put"
  greek.call.delta = getDelta(s,k,t,v,0,"call")
  greek.put.delta = getDelta(s,k,t,v,0,"put")

  greek.call.gamma = getGamma(s,k,t,v,0,"call")
  greek.put.gamma = getGamma(s,k,t,v,0,"put")

  greek.call.theta = getTheta(s,k,t,v,0,"call")
  greek.put.theta = getTheta(s,k,t,v,0,"put")

  greek.call.vega = getVega(s,k,t,v,0,"call")
  greek.put.vega = getVega(s,k,t,v,0,"put")

  greek.call.rho = getRho(s,k,t,v,0,"call")
  greek.put.rho = getRho(s,k,t,v,0,"put")

  greek.call.tprice = blackScholes(s, k, t,v,0,"call")
  greek.put.tprice = blackScholes(s, k, t,v,0,"put")


  return greek;





}
