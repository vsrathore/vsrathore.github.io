
let clickEditable = function(){
  this.onclick = null;
  this.innerHTML = '<input class="editable-input" type="number" id="fname" onblur="blurInput(this)" value='+this.textContent+'>';
  this.classList.remove("hoverstyle");
  let child = this.firstElementChild;
  child.select();
  child.addEventListener('keyup',function(e){ if (e.which == 13 || e.which == 27) this.blur(); });
}

a = document.getElementsByClassName("editable")
for(each of a){ each.onclick = clickEditable; }


blurInput = function(a){
  let parent = a.parentElement;
  parent.innerHTML = a.value;
  parent.onclick = clickEditable;
  parent.classList.add("hoverstyle");
  generateReport();
}


function clickerChange(elem){
  let txt = elem.innerText;
  switch (txt) {
    case "Call": elem.innerText = "Put";  break;
    case "Put": elem.innerText = "Call"; break;
    case "Buy": elem.innerText = "Sell"; break;
    case "Sell": elem.innerText = "Buy"; break;
  }
  generateReport();
}

onselectstart = (e) => {e.preventDefault()}



function clickerClose(a) {
  document.getElementById(a).remove();
  generateReport();
}



function updateStartPoint() {
  var stFrm = 10000000
  tradeCards = document.getElementById("tradeCards").children
  if (tradeCards.length) {
    for(each of tradeCards){
      var tValue = each.querySelectorAll(".clicker")[2].innerText*1
      stFrm = tValue < stFrm ? tValue : stFrm
    }
    stFrm = stFrm-(stFrm*.1)
    stFrm = Math.floor(stFrm/50)*50
    document.getElementById("startFrom").value = stFrm

    let chartLastSlider = document.getElementById("chartLast");
    chartLastSlider.oninput()
    chartLastSlider.onmouseup()

  }
}




function addCard() {
  let randomId = (Math.random()*1).toString(36).replace(/\./g,"A");
  var newCard = `
      <div class="card card-main text-white shadow">
        <div class="card-body" style=" padding: 0rem; background: #f6c23e; ">
          <div class="card-head clicker flow-left" onclick="clickerChange(this)">Call</div>
          <div class="card-head clicker flow-left" onclick="clickerChange(this)">Buy</div>
          <div class="card-close" onclick="clickerClose('`+randomId+`')"><i class="fas fa-minus"></i></div>
        </div>
        <div class="card-hold"> <div class="flow-left">Strike Price</div> <div class="hoverstyle clicker flow-right editable maxwidth-50">11800</div> </div>
        <div class="card-hold"> <div class="flow-left">Current Price</div> <div class="hoverstyle clicker flow-right editable maxwidth-50">23</div> </div>
        <div class="card-hold"> <div class="flow-left">Quantity</div> <div class="hoverstyle clicker flow-right editable maxwidth-50">4950</div> </div>
      </div>
  `
  var div = document.createElement('div');
  div.innerHTML = newCard;
  div.setAttribute('class', 'col-lg-3 mb-4');
  div.setAttribute('id', randomId);
  a = div.querySelectorAll(".editable")
  for(each of a){ each.onclick = clickEditable; }
  document.getElementById('tradeCards').appendChild(div);
  updateStartPoint()
}

drawChart();


function generateReport() {

  var startFrom = Number(document.getElementById("startFrom").value);
  var tickGap = Number(document.getElementById("tickGap").value);
  var chartLast = Number(document.getElementById("chartLast").value);

  let closingPrice = [];
  for (let i = 0; i < chartLast; i++) { closingPrice.push(1*startFrom+(i*tickGap)) }
  let totalPayoff = Array(chartLast).fill(0);
  let tradeCards = document.getElementById("tradeCards").children
  for(each of tradeCards){
      let tradeOptions = each.querySelectorAll(".clicker")
      let trade = []
      for(each of tradeOptions){trade.push(each.innerText)}

      for (let i = 0; i < closingPrice.length; i++) {
        let pay = calculation( { price:closingPrice[i], trade:trade } )
        totalPayoff[i] = totalPayoff[i] + pay
      }
  }
  myLineChart.data.labels = closingPrice
  myLineChart.data.datasets[0].data = totalPayoff
  myLineChart.update()
}



function calculation(data) {
    // data = {price:132, trade:["Call", "Buy", "11800", "23", "4950"]}
    let k;
    if(data.trade[0]==="Call"){
      k = data.price>data.trade[2]? data.price-data.trade[2]-data.trade[3] : -data.trade[3]
    }else{
      k = data.price<data.trade[2] ? data.trade[2]-data.price-data.trade[3]: -data.trade[3]
    }
    let j = data.trade[1]==="Buy"? 1 : -1
    return k*j*data.trade[4]
}


for(each of ['collapseCardChart','collapseCardTrade']){   //open all collapseCard
  document.getElementById(each).previousElementSibling.click();
}



var sliderInputFunction = function() {
  var startFromValue = Number(document.getElementById("startFrom").value)
  var tickGapValue = Number(document.getElementById("tickGap").value)
  var chartLastValue = Number(document.getElementById("chartLast").value)
  var sliderValue2 = startFromValue +  chartLastValue * tickGapValue
  if (this.id==="tickGap") {
    var span = document.getElementById("tickGapValue")
    span.innerText = "Tick Gap : " + tickGapValue
    span.classList.add("hoverX");
    document.getElementById("chartLastValue").innerText = "Chart Last : ("+chartLastValue+") : " + sliderValue2
  } else if(this.id==="chartLast"){
    var span = document.getElementById("chartLastValue")
    span.innerText = "Chart Last : ("+chartLastValue+") : " + sliderValue2
    span.classList.add("hoverX");
  }
}

var sliderMouseUpFunction = function() {
  var sliderValue = Number(this.value);
  if(sliderValue == this.max){ this.max = sliderValue*2; this.min = sliderValue}
  else if (sliderValue == this.min ) {
    if(this.min>100){ this.max = sliderValue; this.min = sliderValue/2;}
    else{ this.max = 100; this.min = 1; }
  }
  generateReport();
  var spanId = this.id==="tickGap" ? "tickGapValue" : "chartLastValue";
  document.getElementById(spanId).classList.remove("hoverX");
}



document.getElementById("startFrom").onchange = function(){
  let chartLastSlider = document.getElementById("chartLast");
  chartLastSlider.oninput()
  chartLastSlider.onmouseup()
}

var tickGapSlider = document.getElementById("tickGap");
tickGapSlider.oninput = sliderInputFunction
tickGapSlider.onmouseup = sliderMouseUpFunction

var chartLastSlider = document.getElementById("chartLast");
chartLastSlider.oninput = sliderInputFunction
chartLastSlider.onmouseup = sliderMouseUpFunction
