var globalData = {}

console.log('Index loaded');

setBaseOption()
function setBaseOption() {
  var k = {
    d:['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
    m:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'],
    y:[2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035],
  }

  Object.keys(k).forEach(y=>{
    var select = document.getElementById(y+"option");
    k[y].forEach(x=>{
      var opt = document.createElement('option');
      opt.value = x;
      opt.innerHTML = x;
      select.appendChild(opt);
    })

  })

var d = new Date(); d.setDate(d.getDate() - 1)
d = new Date(d).toDateString().split(" ")
document.getElementById('doption').value = d[2]
document.getElementById('moption').value = d[1].toUpperCase()
document.getElementById('yoption').value = d[3]
}










function oiBtnClick() {
  var url = "https://script.google.com/macros/s/AKfycbxva709ZOlClnvgeKt4tAsAacBqmR1jASFqdgPtrhpWI5qiBM7u/exec"
  document.getElementById('mainOption').classList.add("hiddenClass");
  document.getElementById('oiReport').classList.add("hiddenClass");

  var noti = document.getElementById('notification')
  noti.classList.remove("hiddenClass");
  noti.innerHTML = '<span>Getting Data. Please wait.....</span><br><img class="loading" src="loading.gif">'

  console.log("please wait");
  var data = new FormData();

  data.append('date',document.getElementById('doption').value)
  data.append('month',document.getElementById('moption').value)
  data.append('year',document.getElementById('yoption').value)

  fetch(url, { method: "POST", body: data })
  .then(function(res){ return res.json(); })
  .then(function(data){ fetchDone(data) })
}


function fetchDone(data){
  if(data){
    console.log('fetchDone');
    document.getElementById('mainOption').classList.remove("hiddenClass");

    document.getElementById('notification').classList.add("hiddenClass");
    document.getElementById('selectOption').classList.add("hiddenClass");
    globalData = processFetchedData(data.data)
    console.log('scriptDone');
    addScripts(globalData)
  }else{
   document.getElementById('notification').innerText = "Data not available for selected date. Please check date again.";
  }


}




function processFetchedData(data){
	let p = data.map(x=>{
        var l = {}
      	data[0].forEach((y,index)=>{l[y]=x[index]})
        return l
	})
	let l = {}
	p.forEach(x=>{
		if(l[x.SYMBOL]){ x.INSTRUMENT.includes("FUT") ? l[x.SYMBOL].base.push(x) : l[x.SYMBOL].option.push(x)
		}else{ l[x.SYMBOL] = x.INSTRUMENT.includes("FUT") ? {base:[x],option:[]} : {base:[],option:[x]}		}
	})
  delete l.SYMBOL
  return l
}



function addScripts(data) {
  var select = document.getElementById("scripts");
  Object.keys(data).forEach(x=>{
    var opt = document.createElement('option');
    opt.value = x;
    opt.innerHTML = x;
    select.appendChild(opt);
  })
changeFunction()

}

function changeFunction(){
  var select = document.getElementById("subscripts");
  var selectscript = document.getElementById("scripts").value;
  var tempobj = {"All":""}
  globalData[selectscript].option.forEach(x=>{
    tempobj[x.EXPIRY_DT] = ""
  })

  select.innerText = ""
  Object.keys(tempobj).forEach(x=>{
    var opt = document.createElement('option');
    opt.value = x;
    opt.innerHTML = x;
    select.appendChild(opt);
  })

}


function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) { return sortOrder == -1 ? Number(b[property])- Number(a[property]) :  Number(a[property])- Number(b[property]) }
}


function scriptsBtnClick() {

  let selectScript = document.getElementById("scripts").value
  let subScript = document.getElementById("subscripts").value
  document.getElementsByClassName("textHead")[0].innerText = "Base Script - "+ selectScript +" : "+ subScript
  var k = subScript==="All" ? globalData[selectScript].option : globalData[selectScript].option.filter(x => x.EXPIRY_DT===subScript)
  k = k.sort(dynamicSort("CHG_IN_OI"))

  showData({id:'roiIndex',arr:globalData[selectScript].base,})
  showData({id:'roiTop',arr:k.slice(-5),})
  showData({id:'roiBottom',arr:k.slice(0,5),})
  document.getElementById('oiReport').classList.remove("hiddenClass");
};



function showData(a) {
  let base = document.getElementById(a.id)
  base.innerText = '';
  a.arr.forEach(x=>{
    var k = createElm(x)
    base.appendChild(k.item(0))
  })
}

function createElm(a) {
  var hash = Math.random().toString(36).substring(2);
  var stg = `
    <div onclick="showDetail('`+hash+`')">
      <div class="base">
        <div class="side">
          <div class="scptName">`+a.STRIKE_PR+" "+a.OPTION_TYP+`</div> <div class="exp">`+a.EXPIRY_DT+`</div>
        </div>
        <div class="oiside">
          <div class="oipart"> <div class="oinum">`+a.OPEN_INT+`</div> <div class="oitext">OI</div> </div>
          <div class="oipart"> <div class="oinum">`+a.CHG_IN_OI+`</div> <div class="oitext">Chng OI</div> </div>
          <div class="oipartx"> <div class="oinum">`+(a.CHG_IN_OI/a.OPEN_INT*100).toFixed(2)+"%"+`</div> <div class="oitext">% OI</div> </div>
          <div class="oipart"> <div class="oinum">`+a.CLOSE+`</div> <div class="oitext">Close</div> </div>
        </div>
      </div>

      <div class="detail" id="`+hash+`" style="height:0px;">
        <div class="oid"><div class="oinum">`+((a.SETTLE_PR-a.OPEN)/a.OPEN*100).toFixed(2)+"%"+`</div> <div class="oitext">% PrcChng</div></div>
        <div class="oid"><div class="oinum">`+a.CONTRACTS+`</div> <div class="oitext">Volume</div></div>
        <div class="oid"><div class="oinum">`+a.OPEN+`</div> <div class="oitext">Open</div></div>
        <div class="oid"><div class="oinum">`+a.HIGH+`</div> <div class="oitext">High</div></div>
        <div class="oid"><div class="oinum">`+a.LOW+`</div> <div class="oitext">Low</div></div>
      </div>
    </div>
  `
  var elm = new DOMParser().parseFromString(stg, 'text/html').body.children
  return elm
}






function showDetail(a) {
  p = document.getElementsByClassName("detail")
  Array.from(p).forEach((x) => {
    if(x.id!=a){
      x.style.height="0px"
      x.parentElement.classList.remove("parentClass")
    }
  });

  var k = document.getElementById(a)
  if(k.style.height ==="0px"){
    k.parentElement.classList.add("parentClass");
    k.style.height =  window.getComputedStyle(k.previousElementSibling).height
  }else{
    k.parentElement.classList.remove("parentClass")
    k.style.height =  "0px"
  }
}
