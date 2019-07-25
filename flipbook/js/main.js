/**
 * main.js
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/**
GoogleAnalytics Function
*/
let googleTag = {
  readStatus : function(){
    var bookName = document.getElementsByClassName("title--full")[0].innerText
    var a = document.getElementsByClassName("scroll-wrap")[0]
    var readPercentage = Math.floor(a.scrollTop/(a.scrollHeight-window.innerHeight)*100)
    gtag('event','readStatus',{ 'event_category': 'book', 'event_label': bookName, 'value':readPercentage})
  },

  openStatus : function(item){
    var bookName = item.children[0].innerText
    gtag('event','open',{ 'event_category': 'book', 'event_label': bookName})
  }

};

function setReadStatus(){
  var a = document.getElementsByClassName("scroll-wrap")[0]
  var readPercentage = (a.scrollTop/(a.scrollHeight-window.innerHeight)*100).toFixed(2)
  document.getElementById("articleClose").style.setProperty("--readStatus",readPercentage+"%")
}


function getDateFormatted(timestamp){
  return new Date(timestamp).toLocaleDateString("default", {year: 'numeric', month: 'short', day: 'numeric' })
}



var bookStatus = 'closed';
function reload() {
  if (bookStatus==='open') { closeBook(); }
  closeMenu();
}

function triggerLoader(){
  if(loadMore){
    getFireData()
  }
  loadMore = false
}

var loadMore = true;
window.addEventListener('scroll', function() {
	var element = document.querySelector('#loadMore');
	var position = element.getBoundingClientRect();
	if( (position.top >= 0 && position.bottom <= window.innerHeight*2) || (position.top < window.innerHeight*2 && position.bottom >= 0) ) {
    triggerLoader()
	}else{
    loadMore = true;
  }
});





 var config = {
	 apiKey: "AIzaSyBRMv_Xxgd5YFjJ4fVbSua6VfWeFZsAgfM",
	 authDomain: "apr2019-7a53b.firebaseapp.com",
	 databaseURL: "https://apr2019-7a53b.firebaseio.com",
	 projectId: "apr2019-7a53b",
	 storageBucket: "apr2019-7a53b.appspot.com",
	 messagingSenderId: "731382450272"
 };
 firebase.initializeApp(config);
 var db = firebase.firestore();
 // console.log(db);
 let books = [];
 let bookSummary = {};
 let initial = true;
 let lastTimeStamp;


 getFireData()
 function getFireData() {
   books = [];
   // bookSummary = {};

   let fireBooks;
  if(initial){
    fireBooks = db.collection("/books").orderBy("timestamp","desc").limit(5)
    initial = false;
  }else{
    fireBooks = db.collection("/books").where("timestamp", "<", lastTimeStamp).orderBy("timestamp","desc").limit(5)
  }

fireBooks.get().then(querySnapshot => {
  if(querySnapshot.docs.length){
    lastTimeStamp = querySnapshot.docs[querySnapshot.docs.length-1].data().timestamp
    console.log(lastTimeStamp);
    querySnapshot.forEach((doc) => {
      var dData = doc.data()
      books.push({id:doc.id, title:dData.title, author:dData.author,snap:dData.snap,time:dData.time, detail:dData.detail, summary:dData.summary, date:getDateFormatted(dData.timestamp)})
    });
    addHeading(books)
  }else{
    console.log('Done Books');
    document.querySelector('#loadMore').innerText = ""
  }
  }).catch(function(error) {
    console.log("Error getting document:", error);
});


 }




function addArticle(item) {
 let book = bookSummary[item.id]
 let tym = new Date()
 let baseHtml = `
	 <span class="category category--full">Stories for humans</span>
	 <h2 class="title title--full">`+book.title+`</h2>
	 <div class="meta meta--full">
		 <img class="meta__avatar" src="http://tinygraphs.com/labs/isogrids/hexa/`+book.author+`?theme=summerwarmth&numcolors=4&size=120&fmt=svg" />
		 <span class="meta__author">`+book.author+`</span>
		 <span class="meta__date"><i class="fa fa-calendar-o"></i>`+book.date+`</span>
		 <span class="meta__reading-time"><i class="fa fa-clock-o"></i>`+book.time+`</span>
	 </div>
	 <p>`+book.detail+`</p>
   <p>`+book.snap+`</p>
   <p>`+book.summary+`</p>
 `
 let parent = document.getElementsByClassName('content__item')[0]
 parent.innerHTML = baseHtml
}

// addHeading()
function addHeading(books) {

 let parent = document.getElementsByClassName('grid')[0]
 books.forEach(bookDetail=>{
   bookSummary[bookDetail.id] = bookDetail
	 let baseHtml =
	 `
	 <a class="grid__item" id="`+bookDetail.id+`" onClick="readBook(this)">
	 <h2 class="title title--preview">`+bookDetail.title+`</h2>
	 <div class="loader"></div>
	 <span class="category">`+bookDetail.detail+`</span>
	 <div class="meta meta--preview">
	 <div class="meta__avatar">By `+bookDetail.author+`</div>
	 <span class="meta__date"><i class="fa fa-calendar-o"></i>`+bookDetail.date+`</span>
	 <span class="meta__reading-time"><i class="fa fa-clock-o"></i>`+bookDetail.time+`</span>
	 </div>
	 </a>
	 `

	 let tempDiv = document.createElement('div')
	 tempDiv.innerHTML = baseHtml
	 parent.insertBefore(tempDiv.firstElementChild, parent.childNodes[parent.childNodes.length-2]);
 })
}


function closeMenu() {
  var sidebarElX = document.getElementById('theSidebar')
  if( classie.has(sidebarElX, 'sidebar--open') ) { classie.remove(sidebarElX, 'sidebar--open'); }
};


function openMenu() {
  var sidebarElX = document.getElementById('theSidebar')
  if( !classie.has(sidebarElX, 'sidebar--open') ) { classie.add(sidebarElX, 'sidebar--open'); }
};


function readBook(item) {
  googleTag.openStatus(item);
  bookStatus = 'open';
  classie.add(item, 'grid__item--loading');
  setTimeout(function() {
    classie.add(item, 'grid__item--animate');
    setTimeout(function() { loadContent(item); }, 500);
  }, 1000);
};


function loadContent(item) {
  addArticle(item)
  document.getElementById("articleClose").style.setProperty("--readStatus","0%")

  var gic = document.getElementById('gridItemsContainer')
  var cic = document.getElementById('contentItemsContainer')
  var articleClose = document.getElementById('articleClose')

  var dummy = document.createElement('div');
  dummy.className = 'placeholder';

  // set the width/heigth and position
  dummy.style.WebkitTransform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth/gic.offsetWidth + ',' + item.offsetHeight/getViewport('y') + ',1)';
  dummy.style.transform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth/gic.offsetWidth + ',' + item.offsetHeight/getViewport('y') + ',1)';

  classie.add(dummy, 'placeholder--trans-in');
  gic.appendChild(dummy);
  classie.add(document.body, 'view-single');

  setTimeout(function() {
    dummy.style.WebkitTransform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
    dummy.style.transform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
    window.addEventListener('scroll', noscroll);
  }, 25);

  onEndTransition(dummy, function() {
    classie.remove(dummy, 'placeholder--trans-in');
    classie.add(dummy, 'placeholder--trans-out');
    cic.style.top = scrollY() + 'px';
    classie.add(cic, 'content--show');
    let p = document.getElementsByClassName('content__item')[0]
    classie.add(p, 'content__item--show');
    classie.add(articleClose, 'close-button--show');
    classie.addClass(document.body, 'noscroll');

  });
};


function closeBook(){
  if (bookStatus==='open') {
    googleTag.readStatus();
    hideContent();
  }
};

function hideContent() {
  var gridItem = document.getElementsByClassName('grid__item--animate')[0]
  var contentItem = document.getElementsByClassName('content__item')[0];

  var gic = document.getElementById('gridItemsContainer')
  var cic = document.getElementById('contentItemsContainer')
  var articleClose = document.getElementById('articleClose')



  classie.remove(contentItem, 'content__item--show');
  classie.remove(cic, 'content--show');
  classie.remove(articleClose, 'close-button--show');
  classie.remove(document.body, 'view-single');

  setTimeout(function() {
    var dummy = gic.querySelector('.placeholder');

    classie.removeClass(document.body, 'noscroll');

    dummy.style.WebkitTransform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gic.offsetWidth + ',' + gridItem.offsetHeight/getViewport('y') + ',1)';
    dummy.style.transform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gic.offsetWidth + ',' + gridItem.offsetHeight/getViewport('y') + ',1)';

    onEndTransition(dummy, function() {
      // reset content scroll..

      contentItem.parentNode.scrollTop = 0;
      gic.removeChild(dummy);
      classie.remove(gridItem, 'grid__item--loading');
      classie.remove(gridItem, 'grid__item--animate');
      lockScroll = false;
      window.removeEventListener( 'scroll', noscroll );
    });
    bookStatus = 'closed';
  }, 25);
};





var bodyEl = document.body,
  docElem = window.document.documentElement,
  support = { transitions: Modernizr.csstransitions },
  // transition end event name
  transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
  transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
  onEndTransition = function( el, callback ) {
    var onEndCallbackFn = function( ev ) {
      if( support.transitions ) {
        if( ev.target != this ) return;
        this.removeEventListener( transEndEventName, onEndCallbackFn );
      }
      if( callback && typeof callback === 'function' ) { callback.call(this); }
    };
    if( support.transitions ) {
      el.addEventListener( transEndEventName, onEndCallbackFn );
    }
    else {
      onEndCallbackFn();
    }
  }






function scrollX() { return window.pageXOffset || window.document.documentElement.scrollLeft; }
function scrollY() { return window.pageYOffset || window.document.documentElement.scrollTop; }
var lockScroll = false, xscroll, yscroll
function noscroll() {
  if(!lockScroll) {
    lockScroll = true;
    xscroll = scrollX();
    yscroll = scrollY();
  }
  window.scrollTo(xscroll, yscroll);
}


function getViewport( axis ) {
  var client, inner;
  if( axis === 'x' ) {
    client = window.document.documentElement['clientWidth'];
    inner = window['innerWidth'];
  }
  else if( axis === 'y' ) {
    client = window.document.documentElement['clientHeight'];
    inner = window['innerHeight'];
  }
  return client < inner ? inner : client;
}
