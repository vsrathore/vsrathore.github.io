function uc(a){return a.charAt(0).toUpperCase() + a.slice(1);}
var timeout = null;



console.log('fetch js loaded');
let globalData = {}
globalData.status = 'offline'

let divId = document.getElementById('showdata')

function refreshPage(){ location.reload(); }

function getchData(a) {
  setLoader()
  var url = "https://script.google.com/macros/s/AKfycbyvU0KQAELcoKsuKd5H5BmawH_BjxLqfr-OKMPTyEu2ccsimNpE/exec"
  var data = new FormData();
  data.append('fName','source')
  // data.append('url',"https://www.nseindia.com/live_market/dynaContent/live_watch/option_chain/optionKeys.jsp?symbolCode=234&symbol=TATASTEEL&symbol=tatasteel&instrument=OPTSTK&date=-&segmentLink=17&segmentLink=17")
  data.append('url',a.url)

//
  fetch(url, { method: "POST", body: data })
  .then(function(res){ return res.json() })
  .then(function(data){ fetchDone(data) })
}
function fetchDone(data){
  // console.log([data]);
  if(data!= false){

    document.getElementById('secondFirst').innerHTML = '';
    document.getElementById('secondSecond').classList.remove('invisibalCloak')
    document.getElementById('dayprice').classList.remove('invisibalCloak')

    j = data.split('<div class="opttbldata">')[1].split('</table>')[0]+'</table>'
    j = j.replace(/<a href.*">|<\/a>|<img.*" \/>|<img.*"\/>/g,"")
    // console.log(j);
    p = new DOMParser().parseFromString(j, 'text/html').body.children[0]
    // var divID = document.getElementById("showdata")
    // divID.appendChild(p)


    var optionHead = [
      {name:"OI",call:1,put:21},
      {name:"ChngOI",call:2,put:20},
      {name:"Volume",call:3,put:19},
      {name:"IV",call:4,put:18},
      {name:"LTP",call:5,put:17},
      {name:"NetChng",call:6,put:16}
    ]
    var strikeHead = 15
    var totalData = {}
    var tblRows = p.rows
    for(var i=2; i<tblRows.length-1;i++){
      var stk = (tblRows[i].cells[11].innerText).toString()
      totalData[stk] = {call:{},put:{}}
      optionHead.forEach(x=>{
        totalData[stk].call[x["name"]] =  tblRows[i].cells[x.call].innerText.replace(/,/g,"").trim()
        totalData[stk].put[x["name"]] =  tblRows[i].cells[x.put].innerText.replace(/,/g,"").trim()
      })
    }
    console.log(totalData);
    globalData.data = totalData
    globalData.strikeList = Object.keys(totalData)

    j = '<select>'+data.split('.submit();" class="goodTextBox">')[1].split('</span>')[0]
    p = new DOMParser().parseFromString(j, 'text/html').body.children[0]
    var expiryList = []
    for(i=1;i<p.options.length;i++){expiryList.push(p.options[i].value)}
    console.log(expiryList);
    globalData.expiryList = expiryList

    if(globalData.freshExpiry){
      var opt = ''
      expiryList.forEach(x=>{ opt = opt + '<option value="'+x+'">'+x+'</option>' })
      document.getElementById("expiryList").innerHTML = opt
      // <option value="10400">10400</option>
    }


    k = data.split("wrapper_btm")[1].split("<span >")[1].split("</span>")[0].split(">")[1].split("<")[0].split(" ")
    console.log(k);
    globalData.live_market = k
    document.getElementById('firstSecond').innerHTML = k.join(" - ")
    document.getElementById('MarketPrice').value = k[1]


    // k = data.split("wrapper_btm")[1].split("<span >")[1].split("</span>")[0].split(">")[1].split("<")[0].split(" ")
    // console.log(k);
    // globalData.live_market = k
    // document.getElementById('expiryList').value
    document.getElementById('ExpiryDays').value = getExpyDate()


  }else{
    console.log("Data fetched failed");
    document.getElementById('firstSecond').innerHTML = "Error : Please retry, unable to fetch live data."
  }


}



// k = getDelta(100, 100, .086, .1, .0015, "call")
// k = showGreek(100, 100, .086, .1, "call")
// console.log(k);


inti()
function inti() {
  var scriptList = ["NIFTY","BANKNIFTY","ACC", "ADANIENT", "ADANIPORTS", "ADANIPOWER", "AJANTPHARM", "ALBK", "AMARAJABAT", "AMBUJACEM", "APOLLOHOSP", "APOLLOTYRE", "ARVIND", "ASHOKLEY", "ASIANPAINT", "AUROPHARMA", "AXISBANK", "BAJAJ-AUTO", "BAJAJFINSV", "BAJFINANCE", "BALKRISIND", "BANKBARODA", "BANKINDIA", "BATAINDIA", "BEL", "BEML", "BERGEPAINT", "BHARATFIN", "BHARATFORG", "BHARTIARTL", "BHEL", "BIOCON", "BOSCHLTD", "BPCL", "BRITANNIA", "BSOFT", "CADILAHC", "CANBK", "CANFINHOME", "CASTROLIND", "CEATLTD", "CENTURYTEX", "CESC", "CGPOWER", "CHENNPETRO", "CHOLAFIN", "CIPLA", "COALINDIA", "COLPAL", "CONCOR", "CUMMINSIND", "DABUR", "DCBBANK", "DHFL", "DISHTV", "DIVISLAB", "DLF", "DRREDDY", "EICHERMOT", "ENGINERSIN", "EQUITAS", "ESCORTS", "EXIDEIND", "FEDERALBNK", "GAIL", "GLENMARK", "GMRINFRA", "GODFRYPHLP", "GODREJCP", "GODREJIND", "GRASIM", "GSFC", "HAVELLS", "HCLTECH", "HDFC", "HDFCBANK", "HEROMOTOCO", "HEXAWARE", "HINDALCO", "HINDPETRO", "HINDUNILVR", "HINDZINC", "IBULHSGFIN", "ICICIBANK", "ICICIPRULI", "IDBI", "IDEA", "IDFC", "IDFCFIRSTB", "IFCI", "IGL", "INDIACEM", "INDIANB", "INDIGO", "INDUSINDBK", "INFIBEAM", "INFRATEL", "INFY", "IOC", "IRB", "ITC", "JETAIRWAYS", "JINDALSTEL", "JISLJALEQS", "JSWSTEEL", "JUBLFOOD", "JUSTDIAL", "KAJARIACER", "KOTAKBANK", "KSCL", "KTKBANK", "L&TFH", "LICHSGFIN", "LT", "LUPIN", "M&M", "M&MFIN", "MANAPPURAM", "MARICO", "MARUTI", "MCDOWELL-N", "MCX", "MFSL", "MGL", "MINDTREE", "MOTHERSUMI", "MRF", "MRPL", "MUTHOOTFIN", "NATIONALUM", "NBCC", "NCC", "NESTLEIND", "NHPC", "NIITTECH", "NMDC", "NTPC", "OFSS", "OIL", "ONGC", "ORIENTBANK", "PAGEIND", "PCJEWELLER", "PEL", "PETRONET", "PFC", "PIDILITIND", "PNB", "POWERGRID", "PVR", "RAMCOCEM", "RAYMOND", "RBLBANK", "RECLTD", "RELCAPITAL", "RELIANCE", "RELINFRA", "REPCOHOME", "RPOWER", "SAIL", "SBIN", "SHREECEM", "SIEMENS", "SOUTHBANK", "SRF", "SRTRANSFIN", "STAR", "SUNPHARMA", "SUNTV", "SUZLON", "SYNDIBANK", "TATACHEM", "TATACOMM", "TATAELXSI", "TATAGLOBAL", "TATAMOTORS", "TATAMTRDVR", "TATAPOWER", "TATASTEEL", "TCS", "TECHM", "TITAN", "TORNTPHARM", "TORNTPOWER", "TV18BRDCST", "TVSMOTOR", "UBL", "UJJIVAN", "ULTRACEMCO", "UNIONBANK", "UPL", "VEDL", "VGUARD", "VOLTAS", "WIPRO", "WOCKPHARMA", "YESBANK", "ZEEL"]

  var scpId = document.getElementById('scriptList')
  scriptList.forEach(x=>{
    var k = document.createElement("option")
    k.value = x
    k.innerText = x
    scpId.appendChild(k)
  })

}


function setLoader() {
  var loader = `
    <div>Loading data from server</div>
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  `
  document.getElementById('firstSecond').innerHTML = loader
}



function scriptChng() {
  globalData.freshExpiry = true;
  var scpId = document.getElementById('scriptList').value
  console.log(scpId);
  var tempType = ["NIFTY","BANKNIFTY"].includes(scpId)?"OPTIDX":"OPTSTK"
  var tempUrl= "https://www.nseindia.com/live_market/dynaContent/live_watch/option_chain/optionKeys.jsp?symbol="+scpId+"&instrument="+tempType+"&segmentLink=17"
  getchData({url:tempUrl})
}



function addTrade() {
  var hash = Math.random().toString(36).substring(2);

  if(globalData.status==="online"){
    var opt = '<select class="strikeList" oninput="myFunction(this)">'
    globalData.strikeList.forEach(x=>{ opt = opt + '<option value="'+x+'">'+x+'</option>' })
    opt = opt+'</select>'
  }else{
    var opt = '<input type="number" name="stkprice"  placeholder="Strike Price " oninput="myFunction(this)" value="">'
  }

  htm =
  `
    <div id="secondFirst`+hash+`">
      <select class="buysell" oninput="myFunction(this)">
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <select class="callput" oninput="myFunction(this)">
        <option value="call">Call</option>
        <option value="put">Put</option>
      </select>
      `+opt+`
      <input type="number" name="price"  placeholder="Price " oninput="myFunction(this)" value="">
      <input type="number" name="numberofshares"  placeholder="Number of Shares" oninput="myFunction(this)" value="1">
      <button type="button" name="button" onclick="removeTrade('secondFirst`+hash+`')">Remove</button>
    </div>
  `
  var p = new DOMParser().parseFromString(htm, 'text/html').body.children[0]
  var divID = document.getElementById("secondFirst")
  divID.appendChild(p)

  if(globalData.status==="online"){ updatePrice('secondFirst'+hash) }

}

function updatePrice(a) {
  var tempElm = document.getElementById(a)
  var ltp = globalData.data[tempElm.children[2].value][tempElm.children[1].value].LTP
  tempElm.children[3].value = ltp==='-'?0:ltp
}

function removeTrade(a) {
  console.log(a);
  document.getElementById(a).remove()
}



function ShowTrade() {
  var tradeDetail = []
  var minStk = +100000000
  var maxStk = -100000000
  k = document.getElementById('secondFirst')
  for (var i = 0; i < k.childElementCount; i++) {
    var p = k.children[i]
    var tempStkPrice = Number(p.children[2].value)
    minStk = tempStkPrice<minStk?tempStkPrice:minStk
    maxStk = tempStkPrice>minStk?tempStkPrice:maxStk
    tradeDetail[i] = {
      bs:p.children[0].value,
      opType:p.children[1].value,
      stkprice:tempStkPrice,
      price:Number(p.children[3].value),
      qty:Number(p.children[4].value)
    }
  }
  var data = {detail:tradeDetail,minStk:minStk,maxStk:maxStk}
  globalData.optionDetail = data

  var k = document.getElementById("startRange")

  k.value = k.value==="1000"?Math.floor(Math.abs(minStk-minStk*0.1),0):k.value

}

// CalcTrade()
function CalcTrade() {
  ShowTrade()
  var startRange = Number(document.getElementById("startRange").value)
  var stepRange = Number(document.getElementById("stepRange").value)
  var maxPoint = Number(document.getElementById("maxPoint").value)

  var strkArr = []
  var total = {}
  for (var i = 0; i < maxPoint; i++) {
    var p = startRange+stepRange*i
    strkArr.push(p)
    total[p]=0
  }


  var totalReturn = {}
  globalData.optionDetail.detail.forEach((x,index)=>{
    var k = {}
    strkArr.forEach(y=>{
      var opReturn = globalData.calculator[x.opType][x.bs](x,y)
      k[y] = opReturn
      total[y] = total[y]+opReturn
    })
    totalReturn['stg'+index] = {stg:x, data:k, rowName:uc(x.bs)+' '+x.stkprice+' '+uc(x.opType)+' @ '+x.price}
  })
  totalReturn.total = {stg:'Total', data:total, rowName:'Total'}

  var da = []
  Object.keys(totalReturn).forEach(y=>{
    var output = Object.entries(totalReturn[y].data).map(([key, value]) => (
      [Number(key),Math.floor(value,0)]
    ));
    da.push({
      name:y,
      data:output,
      rowName:totalReturn[y].rowName,
      lineWidth: y==='total'?3:0.5,
      visible: y==='total',
      zones: [{ value: 0, color: '#ca2222' }],
    })
  })

  drawChart({xAxis:strkArr, data:da})
  document.getElementById('chartParams').classList.remove('invisibalCloak')
  createMatrixTable({xAxis:strkArr, data:da})
  createGreekTable()



}



function updateExpiry(a) {
  // console.log(a.value);
  globalData.freshExpiry = false;
  document.getElementById('ExpiryDays').value = getExpyDate()
  var scpId = document.getElementById('scriptList').value
  var tempType = ["NIFTY","BANKNIFTY"].includes(scpId)?"OPTIDX":"OPTSTK"
  var tempExp = document.getElementById("expiryList").value
  var tempUrl= "https://www.nseindia.com/live_market/dynaContent/live_watch/option_chain/optionKeys.jsp?segmentLink=17&instrument="+tempType+"&symbol="+scpId+"&date="+tempExp
  getchData({url:tempUrl})
  onlineOffline('Online')

}

function myFunction(a) {
  // console.log(a);
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    if (a.parentElement.id && globalData.status==='online' && (['strikeList','callput'].includes(a.className))) {
      updatePrice(a.parentElement.id)
    }
    CalcTrade()
  }, 1000);
}



  globalData.calculator = {
    call:{
      buy: function(i,spot) {
        if (i.stkprice<spot){ return (spot - i.stkprice - i.price) * i.qty}
        else if (i.stkprice>=spot) { return ( -i.price * i.qty) }
      },
      sell: function(i,spot) {
        if (i.stkprice<spot){ return (i.price - spot + i.stkprice) * i.qty }
        else if (i.stkprice>=spot){ return (i.price * i.qty)}
      }
    },
    put:{
      buy:function(i,spot){
        if (i.stkprice>spot) {return (i.stkprice - spot - i.price) * i.qty}
        else if (i.stkprice<=spot){ return (- i.price * i.qty) }
      },
      sell:function(i,spot){
        if (i.stkprice>spot){ return (i.price - i.stkprice + spot) * i.qty }
        else if (i.stkprice<=spot){ return (i.price * i.qty) }
      }
    }
  }













function createMatrixTable(a) {
  var table = '<table><tr><th>Strategy/Strike</th>'

  a.xAxis.forEach(x=>{ table = table+'<th>'+x+'</th>' })
  table = table+'</tr>'

  a.data.forEach(x=>{
    table = table+'<tr><th>'+x.rowName+'</th>'
    x.data.forEach(y=>{ var cls = y[1]<0?' class="negVal"':""; table = table+'<td'+cls+'>'+y[1]+'</td>' })
    table = table+'</tr>'
  })
  var p = new DOMParser().parseFromString(table, 'text/html').body.children[0]
  var divID = document.getElementById("matrixTable")
  divID.innerHTML = table
}



function getGreekValues(a) {
  // console.log(a);
  // a = {bs: "sell", opType: "call", stkprice: 10400, price: 161.55, qty: 5100}

    var expDays = document.getElementById("ExpiryDays").value/365
    // console.log([Number(globalData.live_market[1]),a.stkprice,expDays,a.price,a.opType]);
    var p = showGreek(Number(document.getElementById('MarketPrice').value),a.stkprice,expDays,a.price,a.opType)
    return {volatility:p.volatility , data:p[a.opType]};

}


function onlineOffline(a) {
console.log(a);
// Resetting elements
  ['firstSecond','secondFirst','container','matrixTable','greekTable'].forEach(x=>{ document.getElementById(x).innerHTML = ''; })
  document.getElementById('chartParams').classList.add('invisibalCloak')
// Resetting elements end

  globalData.status=a.toLowerCase()
  var k = a==='Online'?{shw:'online',hid:'offline'}:{hid:'online',shw:'offline'}

  var elms = document.getElementsByName(k.shw)
  elms.forEach(x=>{ x.classList.remove("invisibalCloak"); })

  var elms = document.getElementsByName(k.hid)
  elms.forEach(x=>{ x.classList.add("invisibalCloak"); })

}

function getExpyDate() {
  var one_day=1000*60*60*24;
  var j = new Date().toJSON().split("T")[0]
  var date1_ms = new Date(j).getTime();
  var k = document.getElementById("expiryList").value
  var date2_ms = k ? new Date(k).getTime() : new Date().getTime()
  // console.log(j,date2_ms,date1_ms);
  var difference_ms = date2_ms - date1_ms;
  var expDays = Math.round(difference_ms/one_day)
  return expDays;
}

function createGreekTable() {
  var table = '<table><tr>'

  var a = ['Trade/Greek','Delta','Gamma','Theta','Vega','Rho','Volatility']
  a.forEach(x=>{ table = table+'<th>'+x+'</th>' })
  table = table+'</tr>'


  globalData.optionDetail.detail.forEach((x,index)=>{
    table = table+'<tr><th>'+uc(x.bs)+' '+x.stkprice+' '+uc(x.opType)+' @ '+x.price+'</th>'
    var y = getGreekValues(x)
    for (var i = 1; i < a.length-1; i++) {
      table = table+'<td>'+Number(y.data[a[i].toLowerCase()]).toFixed(4)+'</td>'
    }
    table = table+'<td>'+ Number(y.volatility*100).toFixed(4)+'%</td>'
    table = table+'</tr>'
  })

  var divID = document.getElementById("greekTable")
  divID.innerHTML = table
}
