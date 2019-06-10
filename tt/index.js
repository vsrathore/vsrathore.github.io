async function getData(a) {
  var res = await fetch(a.url, { method: a.type, body: a.data })
  return res.json()
}


function fetchData() {
  loopX = !loopX;
  fetchDatafeed()
}

var elem = document.getElementById("loader");


function fetchDatafeed() {

  document.getElementById("fetchData").innerText = loopX?"Stop":"Fetch Data"
  if (!loopX) {
    clearTimeout(playAudio);
    clearTimeout(loopFetch);
  }

  elem.innerText = "Getting status...."

  var kk = [cls.value, dDate.value, dest.value, quota.value, source.value, tNumber.value]
  var url = "https://script.google.com/macros/s/AKfycbzTXI46FBy8UBoyx1KxPxvdU-dA8XRl_rFl4dsRK3i91FUB_jLu/exec?ds=trainStatus&params="+kk.join('-')
  getData({ url  : url, type : "GET", })
  .then(y=>{
    fetchSuccessX(y)
  })
  .catch(error => {
    console.log(y);
    console.error(error)
  })
}


var playAudio
var loopFetch
function fetchSuccessX(y){
 var waitTime = timer
   var k = JSON.parse(y.data.res)
      var sts = k.body.availability[0].status
      document.getElementById("currentStatus").innerHTML = new Date().toJSON().split("T").join(" ").replace("Z","")+"  "+sts

      var p = document.createElement("div")
      p.innerHTML = new Date().toJSON().split("T").join(" ").replace("Z","")+" --- "+sts
      document.getElementById("allStatus").prepend(p)

      if(sts.includes("AVBL")){
        waitTime = 3000;
        audio1.play()
        // playAudio = setTimeout(function(){ audio1.load() }, 3000)
      }

      loopFetch = setTimeout(function(){ loopX?fetchDatafeed():null; }, waitTime);
}


function setParams() {
  var kk = [cls.value, dDate.value, dest.value, quota.value, source.value, tNumber.value]
  document.getElementById("inputsParam").innerText = kk.join("_")
}
function showInputs() {
  setParams()
  var checkBox = document.getElementById("showInputs");
  var io = document.getElementById("inputs");
  var ip = document.getElementById("inputsParam");
  if (checkBox.innerText == "Show Input"){
    io.style.display = "block";
    ip.style.display = "none";
    checkBox.innerText = "Hide Input"
  } else {
     io.style.display = "none";
     ip.style.display = "block";
     checkBox.innerText = "Show Input"
  }
}



var timer
var loopX = false;
var audio1 = new Audio('https://raw.githubusercontent.com/vsrathore/vsrathore.github.io/master/in/beep-07.mp3')

// audio1.loop = true
var tempDate = new Date().toJSON().split("T")[0].replace(/-/g,"")
document.getElementById("dDate").value = tempDate
setParams()

var played = false
alldiv.addEventListener('touchstart', function() {
  if(played) return;
	played = true
	audio1.play()
	alldiv.onclick = ''
}, false)
