async function fetchData(a) {
  var res = await fetch(a.url, { method: a.type, body: a.data })
  return res.json()
}


function setLoader(a) {
  document.getElementById('firstSecond').innerHTML = a
}



fetchDatafeed()
function fetchDatafeed() {
  setLoader('Getting news feed, please wait....')
  let base = document.getElementById("oiReport")
  base.innerHTML = ""

  var url  = "https://script.google.com/macros/s/AKfycby9rOe5opUw1XUK7-KSZZe07EZwp8HInnbWVRhQ9LEd3TE6RcE/exec?ds=vishan"
  fetchData({ url  : url, type : "GET", })
  .then(y=>{
    console.log(y);
    y.data.forEach(x=>{
      base.appendChild(processData(x))
    })
    setLoader('')

  })
  .catch(error => console.error(error))
}



function processData(a) {

  var liElm = "<li>"+a.feed.join("</li><li>")+"</li>"
  var baseHtml =
  `
    <div class="">
      <div class="textHead">`+a.name+`</div>
      <div class="reportShow">
        <div style="min-width: 310px; max-width: 100%; margin: 0 auto">
          <ul style="padding: 20px 20px 20px 6%; margin: 0;">
            `+liElm.replace(/#39;/g,"'")+`
          </ul>
        </div>
      </div>
    </div>
  `
  var elm = new DOMParser().parseFromString(baseHtml, 'text/html').body.children[0]
  return elm
}
