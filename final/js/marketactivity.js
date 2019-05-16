function toggleContent(a) {
  var p = document.getElementById(a+"Table");
  p.style.display = p.style.display == "table" ? "none" : "table";

  var a = document.getElementById(a);
  a.style.display = a.style.display === "none" ? "block" : "none";
}

var tHeadgen = [['Sym','symbol'],['LTP','ltp'],['% Chg','netPrice'],['Opn','openPrice'],['Hgh','highPrice'],['Low','lowPrice'],['PClg','previousPrice'],['Qty','tradedQuantity']]
var tHeadgen2 = [['Sym','symbol'],['LTP','ltp'],['% Chg','netPrice'],['Value(Lakhs)','turnoverInLakhs'],['PClg','previousPrice'],['Qty','tradedQuantity']]
var tHeadpower = [['Sym','symbol'],['ExpDt','expiryDate'],['StkPr','strikePrice'],['LTP','lastTradedPrice'],['OI','openInterest'],['Qty','noOfContractsTraded']]

var arr = [
  {tHead:tHeadgen, type:'gen', id:"a", text:"Top Gainers", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/gainers/niftyGainers1.json"},
  {tHead:tHeadgen, type:'gen', id:"b", text:"Top Losers", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/losers/niftyLosers1.json"},
  {tHead:tHeadgen, type:'gen', id:"c", text:"Top FO Gainers", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/gainers/fnoGainers1.json"},
	{tHead:tHeadgen, type:'gen', id:"d", text:"Top FO Losers", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/losers/fnoLosers1.json"},
  {tHead:tHeadgen2, type:'gen', id:"e", text:"Most Active (Value)", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/most_active/allTopValue1.json"},
  {tHead:tHeadgen2, type:'gen', id:"f", text:"Most Active (Volume)", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/most_active/allTopVolume1.json"},
  {tHead:tHeadpower, type:'power', id:"g", text:"Most Active CallsNIFTYVolume", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/most_active/CallsNIFTYVolume.json"},
  {tHead:tHeadpower, type:'power', id:"h", text:"Most Active PutsNIFTYVolume", url:"https://www.nseindia.com/live_market/dynaContent/live_analysis/most_active/PutsNIFTYVolume.json"},
]
var globalIndex
var globalCount







getData()
function getData() {
  globalIndex = 0
  globalCount = 0
  updateProgressBar()
  let base = document.getElementById("oiReport")
  base.innerHTML = ""
  arr.forEach((x,index)=>{
    base.appendChild(createChartElm({text:x.text,id:x.id}))
    drawChartByData(x)

  })
}


function updateProgressBar(){
  let progressBarId = document.getElementById("progressBar")
  let pText =  ((globalIndex)*100/arr.length)
  pText = pText>100?"100%":pText+"%"
  progressBarId.innerText = pText
  progressBarId.style.width = pText
  globalIndex++

  progressBarId.parentElement.style.display = pText==="100%" ?'none':'block';

}


function drawChartByData(x) {
  var data = new FormData();
  data.append('fName','json')
  data.append('url',x.url)

  fetchData({
    url  : "https://script.google.com/macros/s/AKfycbyvU0KQAELcoKsuKd5H5BmawH_BjxLqfr-OKMPTyEu2ccsimNpE/exec",
    type : "POST",
    data : data,
  })
  .then(y=>{
    if(y){
			var jackData = funType[x.type]({y:y, id:x.id});
      drawChartX(jackData)
      document.getElementById(x.id).parentElement.parentElement.classList.remove("hiddenClass")
      document.getElementById(x.id).parentElement.classList.remove("hiddenClass")
      document.getElementById(x.id).parentElement.parentElement.children[0].children[1].style.color='';
      document.getElementById(x.id).parentElement.appendChild(createTableElm({data:y.data,id:x.id,tHead:x.tHead}))
      updateProgressBar()
      return y;
    }else{
      document.getElementById(x.id).parentElement.classList.add("hiddenClass")
      document.getElementById(x.id).parentElement.parentElement.children[0].children[1].style.color='red';
      updateProgressBar()
      if(globalCount>0){alert('Failed to load data:',x.id);}
      return false;
    }
  })

}






var funType = {
	gen: function(y){return {
    id : y.id,
		chartData : y.y.data.map(l=>{
      var vl = Number(l.netPrice)
      return {
        y:vl,
        dataLabels: { color: vl>0?'black':'red', align:vl>0?'right':'left' }}
    }),
		chartLabels : y.y.data.map(l=>{return l.symbol}),
    chartFormat:'{y} %',
	}},

	power: function(y){return {
    id : y.id,
		chartData : y.y.data.map(l=>{
      var vl = Number(l.noOfContractsTraded.replace(/,/g,""))
      return {
        y:vl, toolTipText:this.x +' <br><b>  ' + this.y + '</b>',
        dataLabels: { color: vl>0?'black':'red', align:vl>0?'right':'left'  }}
    }),
		chartLabels : y.y.data.map(l=>{return l.expiryDate+"   "+l.strikePrice+"   "+l.optionType}),
    chartFormat:'{y}',
	}},


}







function refresh(a) {
  globalIndex--
  globalCount++
  let p = confirm("Do you want to refresh data ?")
  if(p){
    let k = {}
    Highcharts.charts.forEach(x=>{ x?k[x.renderTo.id]=x:null })

    if(k[a]){
      var tempIndex = k[a]['index']
      k[a].destroy()
      Highcharts.charts.splice(tempIndex,1)
      document.getElementById(a).parentElement.classList.add("hiddenClass")
      document.getElementById(a).style.display='block'
      var tempTable = document.getElementById(a+'Table')
      if(tempTable){tempTable.remove()}
    }

    myArray = arr.filter(function( obj ) { return obj.id === a; });
    drawChartByData(myArray[0])
  }

}





function createChartElm(a) {
  var stg = `
    <div class="">
      <div class="textHead" style="display: flex;">
        <div style="width:80%;" onclick="toggleContent('`+a.id+`')">
          <span class="refreshText">`+a.text+`</span>
        </div>
        <div style="width:20%;">
          <span class="refreshBtn"  onclick="refresh('`+a.id+`')">⁂</span>
        </div>
      </div>
      <div class="reportShow hiddenClass" id="roiTop"> <div id="`+a.id+`" style="min-width: 310px; max-width: 100%; height: 400px; margin: 0 auto"></div> </div>
    </div>
  `
  var elm = new DOMParser().parseFromString(stg, 'text/html').body.children[0]
  return elm
}


function createTableElm(a) {
  var stg = '<table id="'+a.id+'Table" style="display:none;"><tr>'
  a.tHead.forEach(x=>{ stg = stg + '<th>'+x[0]+'</th>' })
  stg = stg+'</tr> '

  a.data.forEach(x=>{
    stg = stg+'<tr> '
    a.tHead.forEach(y=>{ stg = stg + '<td>'+x[y[1]]+'</td>' })
    stg = stg+'</tr> '

  })
  stg = stg+'</table>'

  var elm = new DOMParser().parseFromString(stg, 'text/html').body.children[0]
  return elm;
}
