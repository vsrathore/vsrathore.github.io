/*! nanoScrollerJS - v0.8.7 - (c) 2015 James Florentino; Licensed MIT */
/iP/i.test(navigator.userAgent) && $('*').css('cursor', 'pointer');
!function(a){return"function"==typeof define&&define.amd?define(["jquery"],function(b){return a(b,window,document)}):"object"==typeof exports?module.exports=a(require("jquery"),window,document):a(jQuery,window,document)}(function(a,b,c){"use strict";var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;z={paneClass:"nano-pane",sliderClass:"nano-slider",contentClass:"nano-content",enabledClass:"has-scrollbar",flashedClass:"flashed",activeClass:"active",iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null,documentContext:null,windowContext:null},u="scrollbar",t="scroll",l="mousedown",m="mouseenter",n="mousemove",p="mousewheel",o="mouseup",s="resize",h="drag",i="enter",w="up",r="panedown",f="DOMMouseScroll",g="down",x="wheel",j="keydown",k="keyup",v="touchmove",d="Microsoft Internet Explorer"===b.navigator.appName&&/msie 7./i.test(b.navigator.appVersion)&&b.ActiveXObject,e=null,D=b.requestAnimationFrame,y=b.cancelAnimationFrame,F=c.createElement("div").style,H=function(){var a,b,c,d,e,f;for(d=["t","webkitT","MozT","msT","OT"],a=e=0,f=d.length;f>e;a=++e)if(c=d[a],b=d[a]+"ransform",b in F)return d[a].substr(0,d[a].length-1);return!1}(),G=function(a){return H===!1?!1:""===H?a:H+a.charAt(0).toUpperCase()+a.substr(1)},E=G("transform"),B=E!==!1,A=function(){var a,b,d;return a=c.createElement("div"),b=a.style,b.position="absolute",b.width="100px",b.height="100px",b.overflow=t,b.top="-9999px",c.body.appendChild(a),d=a.offsetWidth-a.clientWidth,c.body.removeChild(a),d},C=function(){var a,c,d;return c=b.navigator.userAgent,(a=/(?=.+Mac OS X)(?=.+Firefox)/.test(c))?(d=/Firefox\/\d{2}\./.exec(c),d&&(d=d[0].replace(/\D+/g,"")),a&&+d>23):!1},q=function(){function j(d,f){this.el=d,this.options=f,e||(e=A()),this.$el=a(this.el),this.doc=a(this.options.documentContext||c),this.win=a(this.options.windowContext||b),this.body=this.doc.find("body"),this.$content=this.$el.children("."+this.options.contentClass),this.$content.attr("tabindex",this.options.tabIndex||0),this.content=this.$content[0],this.previousPosition=0,this.options.iOSNativeScrolling&&null!=this.el.style.WebkitOverflowScrolling?this.nativeScrolling():this.generate(),this.createEvents(),this.addEvents(),this.reset()}return j.prototype.preventScrolling=function(a,b){if(this.isActive)if(a.type===f)(b===g&&a.originalEvent.detail>0||b===w&&a.originalEvent.detail<0)&&a.preventDefault();else if(a.type===p){if(!a.originalEvent||!a.originalEvent.wheelDelta)return;(b===g&&a.originalEvent.wheelDelta<0||b===w&&a.originalEvent.wheelDelta>0)&&a.preventDefault()}},j.prototype.nativeScrolling=function(){this.$content.css({WebkitOverflowScrolling:"touch"}),this.iOSNativeScrolling=!0,this.isActive=!0},j.prototype.updateScrollValues=function(){var a,b;a=this.content,this.maxScrollTop=a.scrollHeight-a.clientHeight,this.prevScrollTop=this.contentScrollTop||0,this.contentScrollTop=a.scrollTop,b=this.contentScrollTop>this.previousPosition?"down":this.contentScrollTop<this.previousPosition?"up":"same",this.previousPosition=this.contentScrollTop,"same"!==b&&this.$el.trigger("update",{position:this.contentScrollTop,maximum:this.maxScrollTop,direction:b}),this.iOSNativeScrolling||(this.maxSliderTop=this.paneHeight-this.sliderHeight,this.sliderTop=0===this.maxScrollTop?0:this.contentScrollTop*this.maxSliderTop/this.maxScrollTop)},j.prototype.setOnScrollStyles=function(){var a;B?(a={},a[E]="translate(0, "+this.sliderTop+"px)"):a={top:this.sliderTop},D?(y&&this.scrollRAF&&y(this.scrollRAF),this.scrollRAF=D(function(b){return function(){return b.scrollRAF=null,b.slider.css(a)}}(this))):this.slider.css(a)},j.prototype.createEvents=function(){this.events={down:function(a){return function(b){return a.isBeingDragged=!0,a.offsetY=b.pageY-a.slider.offset().top,a.slider.is(b.target)||(a.offsetY=0),a.pane.addClass(a.options.activeClass),a.doc.bind(n,a.events[h]).bind(o,a.events[w]),a.body.bind(m,a.events[i]),!1}}(this),drag:function(a){return function(b){return a.sliderY=b.pageY-a.$el.offset().top-a.paneTop-(a.offsetY||.5*a.sliderHeight),a.scroll(),a.contentScrollTop>=a.maxScrollTop&&a.prevScrollTop!==a.maxScrollTop?a.$el.trigger("scrollend"):0===a.contentScrollTop&&0!==a.prevScrollTop&&a.$el.trigger("scrolltop"),!1}}(this),up:function(a){return function(b){return a.isBeingDragged=!1,a.pane.removeClass(a.options.activeClass),a.doc.unbind(n,a.events[h]).unbind(o,a.events[w]),a.body.unbind(m,a.events[i]),!1}}(this),resize:function(a){return function(b){a.reset()}}(this),panedown:function(a){return function(b){return a.sliderY=(b.offsetY||b.originalEvent.layerY)-.5*a.sliderHeight,a.scroll(),a.events.down(b),!1}}(this),scroll:function(a){return function(b){a.updateScrollValues(),a.isBeingDragged||(a.iOSNativeScrolling||(a.sliderY=a.sliderTop,a.setOnScrollStyles()),null!=b&&(a.contentScrollTop>=a.maxScrollTop?(a.options.preventPageScrolling&&a.preventScrolling(b,g),a.prevScrollTop!==a.maxScrollTop&&a.$el.trigger("scrollend")):0===a.contentScrollTop&&(a.options.preventPageScrolling&&a.preventScrolling(b,w),0!==a.prevScrollTop&&a.$el.trigger("scrolltop"))))}}(this),wheel:function(a){return function(b){var c;if(null!=b)return c=b.delta||b.wheelDelta||b.originalEvent&&b.originalEvent.wheelDelta||-b.detail||b.originalEvent&&-b.originalEvent.detail,c&&(a.sliderY+=-c/3),a.scroll(),!1}}(this),enter:function(a){return function(b){var c;if(a.isBeingDragged)return 1!==(b.buttons||b.which)?(c=a.events)[w].apply(c,arguments):void 0}}(this)}},j.prototype.addEvents=function(){var a;this.removeEvents(),a=this.events,this.options.disableResize||this.win.bind(s,a[s]),this.iOSNativeScrolling||(this.slider.bind(l,a[g]),this.pane.bind(l,a[r]).bind(""+p+" "+f,a[x])),this.$content.bind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.removeEvents=function(){var a;a=this.events,this.win.unbind(s,a[s]),this.iOSNativeScrolling||(this.slider.unbind(),this.pane.unbind()),this.$content.unbind(""+t+" "+p+" "+f+" "+v,a[t])},j.prototype.generate=function(){var a,c,d,f,g,h,i;return f=this.options,h=f.paneClass,i=f.sliderClass,a=f.contentClass,(g=this.$el.children("."+h)).length||g.children("."+i).length||this.$el.append('<div class="'+h+'"><div class="'+i+'" /></div>'),this.pane=this.$el.children("."+h),this.slider=this.pane.find("."+i),0===e&&C()?(d=b.getComputedStyle(this.content,null).getPropertyValue("padding-right").replace(/[^0-9.]+/g,""),c={right:-14,paddingRight:+d+14}):e&&(c={right:-e},this.$el.addClass(f.enabledClass)),null!=c&&this.$content.css(c),this},j.prototype.restore=function(){this.stopped=!1,this.iOSNativeScrolling||this.pane.show(),this.addEvents()},j.prototype.reset=function(){var a,b,c,f,g,h,i,j,k,l,m,n;return this.iOSNativeScrolling?void(this.contentHeight=this.content.scrollHeight):(this.$el.find("."+this.options.paneClass).length||this.generate().stop(),this.stopped&&this.restore(),a=this.content,f=a.style,g=f.overflowY,d&&this.$content.css({height:this.$content.height()}),b=a.scrollHeight+e,l=parseInt(this.$el.css("max-height"),10),l>0&&(this.$el.height(""),this.$el.height(a.scrollHeight>l?l:a.scrollHeight)),i=this.pane.outerHeight(!1),k=parseInt(this.pane.css("top"),10),h=parseInt(this.pane.css("bottom"),10),j=i+k+h,n=Math.round(j/b*i),n<this.options.sliderMinHeight?n=this.options.sliderMinHeight:null!=this.options.sliderMaxHeight&&n>this.options.sliderMaxHeight&&(n=this.options.sliderMaxHeight),g===t&&f.overflowX!==t&&(n+=e),this.maxSliderTop=j-n,this.contentHeight=b,this.paneHeight=i,this.paneOuterHeight=j,this.sliderHeight=n,this.paneTop=k,this.slider.height(n),this.events.scroll(),this.pane.show(),this.isActive=!0,a.scrollHeight===a.clientHeight||this.pane.outerHeight(!0)>=a.scrollHeight&&g!==t?(this.pane.hide(),this.isActive=!1):this.el.clientHeight===a.scrollHeight&&g===t?this.slider.hide():this.slider.show(),this.pane.css({opacity:this.options.alwaysVisible?1:"",visibility:this.options.alwaysVisible?"visible":""}),c=this.$content.css("position"),("static"===c||"relative"===c)&&(m=parseInt(this.$content.css("right"),10),m&&this.$content.css({right:"",marginRight:m})),this)},j.prototype.scroll=function(){return this.isActive?(this.sliderY=Math.max(0,this.sliderY),this.sliderY=Math.min(this.maxSliderTop,this.sliderY),this.$content.scrollTop(this.maxScrollTop*this.sliderY/this.maxSliderTop),this.iOSNativeScrolling||(this.updateScrollValues(),this.setOnScrollStyles()),this):void 0},j.prototype.scrollBottom=function(a){return this.isActive?(this.$content.scrollTop(this.contentHeight-this.$content.height()-a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTop=function(a){return this.isActive?(this.$content.scrollTop(+a).trigger(p),this.stop().restore(),this):void 0},j.prototype.scrollTo=function(a){return this.isActive?(this.scrollTop(this.$el.find(a).get(0).offsetTop),this):void 0},j.prototype.stop=function(){return y&&this.scrollRAF&&(y(this.scrollRAF),this.scrollRAF=null),this.stopped=!0,this.removeEvents(),this.iOSNativeScrolling||this.pane.hide(),this},j.prototype.destroy=function(){return this.stopped||this.stop(),!this.iOSNativeScrolling&&this.pane.length&&this.pane.remove(),d&&this.$content.height(""),this.$content.removeAttr("tabindex"),this.$el.hasClass(this.options.enabledClass)&&(this.$el.removeClass(this.options.enabledClass),this.$content.css({right:""})),this},j.prototype.flash=function(){return!this.iOSNativeScrolling&&this.isActive?(this.reset(),this.pane.addClass(this.options.flashedClass),setTimeout(function(a){return function(){a.pane.removeClass(a.options.flashedClass)}}(this),this.options.flashDelay),this):void 0},j}(),a.fn.nanoScroller=function(b){return this.each(function(){var c,d;if((d=this.nanoscroller)||(c=a.extend({},z,b),this.nanoscroller=d=new q(this,c)),b&&"object"==typeof b){if(a.extend(d.options,b),null!=b.scrollBottom)return d.scrollBottom(b.scrollBottom);if(null!=b.scrollTop)return d.scrollTop(b.scrollTop);if(b.scrollTo)return d.scrollTo(b.scrollTo);if("bottom"===b.scroll)return d.scrollBottom(0);if("top"===b.scroll)return d.scrollTop(0);if(b.scroll&&b.scroll instanceof a)return d.scrollTo(b.scroll);if(b.stop)return d.stop();if(b.destroy)return d.destroy();if(b.flash)return d.flash()}return d.reset()})},a.fn.nanoScroller.Constructor=q});
function clicker(id,a){ var j = $("#"+id); j.off("click"); j.click(function(){a();}); }


var toggler = null;
var togglerText = null;
var proData = null;
var funquid = null;

function ftoggler(toggler){
	var k = $(toggler);
	k.closest('.category').siblings().removeClass('active');
	k.closest('.category').toggleClass('active');
}
// window.location.replace(a);
$(function(){

	$(document).on('click', '.toggle', function (e) {
		e.preventDefault();
		toggler = this;
		ftoggler(toggler);
	});

	$(".nano").nanoScroller({iOSNativeScrolling:true});

	$('a[href="#navi"],.nav-overlay').on('click',function(e){
		e.preventDefault();
		$('.navi').toggleClass('active');
		if($('.navi').hasClass('active')){
			$('.nav-overlay').fadeIn(100);
		}else{
			$('.nav-overlay').fadeOut(100);
		}
	});
});



$(document).ready( function() {

	fireInit();
	var db = firebase.firestore();

	// fireLog();

	// var loader = document.getElementById('superModal');

	// Get the modal
	var modal = document.getElementById('myModal');
	var modalpar = document.getElementById("fpar");
	var span = document.getElementsByClassName("close")[0];

	var fdata = [$("#fdate"),$("#fpar"),$("#fqty"),$("#fprice")]

	span.onclick = function() { modalpar.style.display = "none"; modal.style.display = "none";}    // When the user clicks on <span> (x), close the modal
	modal.onclick = function(event) { if (event.target == modal) { modalpar.style.display = "none"; modal.style.display = "none"; ftoggler(toggler);}	}     // When the user clicks anywhere outside of the modal, close it

	function show_model(){
		var el = toggler.closest(".category").getElementsByClassName("head");
		$("#unqid")[0].innerText = $(el).attr("id");
		var tempx = el[0].innerText;
		// console.log($(el).attr("id"));     //Id of script in FireStore data
		if(tempx != togglerText){$.each(fdata,function(index, value){value.val(null);});}
		togglerText = tempx;
		document.getElementsByClassName("fhtxt")[0].innerHTML = togglerText
		modalpar.value = togglerText;
		// modalpar.style.display=""
		modal.style.display = "block";
		ftoggler(toggler);
	};

	$(document).on('click', '#myBtn', function () {
		ttype.val("Buy");
		switch_modal("Buy");
		show_model();
	});

	$(document).on('click', '#mBtn', function () {
		ttype.val("Sell");
		switch_modal("Sell");
		show_model();
	});

	$(document).on('click', '#mDel', function () {
		if(confirm("Are you sure to Delete this script?")){
			var sdf = $(toggler.closest(".category").getElementsByClassName("head")).attr("id");
			db.collection('main/'+funquid+'/trade').doc(sdf).delete().then(function() {
					myFunction4();
					console.log("Document successfully deleted!");
			}).catch(function(error) {
			    console.error("Error removing document: ", error);
			});
		};
	});


	var ttype = $("#country");
	var btn = $("#fbtn");
	var fhtxt = $("#fhtxt");
	var fclose = $("#close");
	var fmodal = $("#modal-content");

	function switch_modal(a){
		btn.text(a);
		if(a=="Sell") {
			btn.addClass("fbtn-sell");
			fhtxt.addClass("fhtxt-sell");
			fclose.addClass("close-sell");
			fmodal.addClass("modal-sell");
		} else {
			btn.removeClass("fbtn-sell");
			fhtxt.removeClass("fhtxt-sell");
			fclose.removeClass("close-sell");
			fmodal.removeClass("modal-sell");
		}
	};


	ttype.change(	function(){	switch_modal(ttype.val());	});

	$(document).on('click', '.jactive', function (e) {

		if($(".category.active").length){
			ftoggler($(".category.active div.links-wrap div.toggle"));
		}
		else{
			var par = this.parentElement.parentElement;
			var ihtml = '<div class="category"><div class="statistic-wrap" id="mySpan">'+this.innerHTML+'</div></div>' + sumryTData($(this.childNodes).attr("id"));
			$(par).animate({'opacity': 0}, 100, function(){	$(par).html(ihtml).animate({'opacity': 1}, 1000);	});
			e.preventDefault();
		};

	});



	$(document).on('click', '#fplus', function () {
		ttype.val("Buy");
		switch_modal("Buy");
		addScript();
	});


	function addScript() {
		document.getElementsByClassName("fhtxt")[0].innerHTML = "New Script";
		$("#unqid")[0].innerText = "";
		$.each(fdata,function(index, value){value.val(null);});
		modalpar.style.display = "";
		modal.style.display = "block";
	}


	$(document).on('click', '#title', function () {
		console.log('Title clicked');
		// alert("Show cached data");
		if(proData){showProData(proData);}
		else{blnk();}
	});





	function myFunction4(){
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				funquid = user.uid;
				var par = db.collection('main/'+user.uid+'/trade')
				par.get()
				.then(function(querySnapshot) {
					if(querySnapshot.size==0){
						blnk();
					}
					else{
						proData = querySnapshot.docs;
						showProData(proData);
					};
				})
				.catch(function(error) { alert(error);console.log("Error getting documents: ", error); });
				// console.log('Logged In : '+ user.uid);
			} else { alert('Please Login first'); window.location.replace('/splash.html'); console.log('User not Logged in');}
		});

	};

// If on iphone, append is not working
	// $(".category-wrap").append(sumry(value.data()))
	// // $(".category-wrap").hide();
	// // $(".category-wrap").get(0).offsetHeight;
	// // $(".category-wrap").show();







function blnk() {
	console.log("blnk");
	$('.category-wrap').empty();
	if(navigator.onLine){
		var noData = '<div class="category"><div class="statistic-wrap jactive" id="mySpan"><div class="head" style="margin-top: 75px; font-weight: 100;">Portfolio is empty. Add some script.</div></div></div>'
	}else{
		var noData = '<div class="category"><div class="statistic-wrap jactive" id="mySpan"><div class="head" style="margin-top: 75px; font-weight: 100;">Internet connection error.</div></div></div>'
	}
	$('.category-wrap').append(noData);
};


function showProData(a) {
	$(".category").remove();
	$(".tdetail").remove();
	$.each(a, function(index, value){
		$(".category-wrap").append(sumry(value))
		// console.log(index+" : "+value.id);
	});
};


var k = {"buyAmount":496.32, "buyAvg":13.78666666666667, "buyQty":36, "filtr":true, "lastPrice":17.12, "lastQty":12, "particular":"HUDCO", "sellAmount":0, "sellAvg":0, "sellQty":0}

function sumry(k){
	var idx = k.id;
	k = k.data();
	var x = k.buyQty-k.sellQty;
	var bAvg = (k.buyAmount/k.buyQty).toFixed(2);
	var sAvg = (k.sellAmount/k.sellQty).toFixed(2);
	if(x>0){var inAvg = (k.buyAmount/k.buyQty).toFixed(2)} else if(x<0){var inAvg = (k.sellAmount/k.sellQty).toFixed(2)} else{var inAvg = "-"}
	var cQty = Math.min(k.buyQty,k.sellQty);
	var pl = ((sAvg-bAvg)*cQty).toFixed(0);

	var tempSum= '<div class="category"><div class="statistic-wrap jactive" id="mySpan"><div class="head" id='+idx+'>'+k.particular+'</div>'
	tempSum += '<div class="statistic"><div class="count">'+x+'</div><div class="title">@ '+inAvg+'</div><div class="supertitle">Inventory</div></div>'
	tempSum += '<div class="statistic"><div class="count">'+k.lastQty+'</div><div class="title">@ '+k.lastPrice+'</div><div class="supertitle">Last</div></div>'
	tempSum += '<div class="statistic"><div class="count">'+cQty+'</div><div class="title">'+pl+' /-</div><div class="supertitle">Booked P/L</div></div></div>'
	tempSum += '<div class="links-wrap"><div class="toggle"><i class="fa faToggle"></i></div><div class="links"><a id="myBtn"><i class="fa fa-plus faLink"></i></a><a id="mDel"><i class="fa fa-trash faLink"></i></a><a id="mBtn"><i class="fa fa-minus faLink"></i></a></div></div></div>'

	return tempSum;
};


myFunction4();






clicker('logout',myFunction3);
function myFunction3(){
  console.log('Trying to LogOut');
  firebase.auth().signOut().then(function() {
    console.log("Sign-out successful.");
		// window.location.replace("/splash.html");
  }).catch(function(error) {
    console.log("An error happened.");
  });
};



$(document).on('click', '#fbtn', function () {
	// console.log('sendData clicked');
	// span.onclick;
	// sendData()
	btn.text("Wait..");
	sendDataMain();

	// ftoggler(toggler);
});






function sendDataMain(par){
	fuid = $("#unqid")[0].innerText;
	par = $("#fpar")[0].value;
	if(fuid){
		sendData();
	}else{
		var jj = db.collection('main/'+funquid+'/trade').where("particular", "==", par)
	      jj.get()
	      .then(function(querySnapshot) {
	        if(querySnapshot.size==0){
	          var newPar = db.collection('main/'+funquid+'/trade/').doc()
	          newPar.set({ filtr:true, particular: par, buyAmount:0, sellAmount:0, buyQty:0, sellQty:0, buyAvg:0, sellAvg:0, lastQty:0, lastPrice:0 })
	          .then(function() {
	            $("#unqid")[0].innerText = newPar.id;
							sendData();
	          })
	          .catch(function(error) { console.error("Error adding document: ", error); });}
	        else{
						console.log("Particular already added into portfolio.");
						$("#unqid")[0].innerText = querySnapshot.docs[0].id;
						sendData();
	        };
	      })
	      .catch(function(error) { console.log("Error getting documents: ", error); });
	};
};







function sendData(){
	console.log(funquid);
	if(funquid && checkData()){
		var newTrade = db.collection('main/'+funquid+'/trade/'+fuid+'/tdetail').doc()
		var par = db.collection('main/'+funquid+'/trade/').doc(fuid)
		return db.runTransaction(function(transaction) {
			return transaction.get(par).then(function(sfDoc) {
				var a = sub5(sfDoc.data(), qty, date, tradeType, price)
				transaction.update(par, a[0])
				transaction.set(newTrade, a[1])
			});
		})
		.then(function() {
			modalpar.style.display = "none";
			modal.style.display = "none";
			myFunction4();
			myFunction7(fuid, false);
			console.log("Transaction successfully committed!");
			$("#unqid")[0].innerText = "";
			$.each(fdata,function(index, value){value.val(null);});
		})
		.catch(function(error) { console.log("Error: ", error); });
	}else {
		console.log("User not logged in. Please login");
	};
};


var fuid, par, date, qty, price, tradeType
function checkData() {
	fuid = $("#unqid")[0].innerText;
	par = $("#fpar")[0].value;
	date = $("#fdate")[0].value;
	qty = ($("#fqty")[0].value) * 1;
	price = ($("#fprice")[0].value) * 1;
	tradeType = $("#country")[0].value;

	var allData = [fuid, par, date, qty, price, tradeType]
	var tempIndex = 0;
	$.each(allData, function(a,value){
		if(value){
			tempIndex += 1;
		}
	})
	if(tempIndex==6){return true}
	btn.text(tradeType);
	console.log("Empty form");
	alert("Please complete fill form")
	return false;
};


function sub5(a, qty, date, tradeType, price){

  if (tradeType=="Buy") {
    var buyQty = (a.buyQty + qty) ;
    var buyAmount = a.buyAmount + (qty*price) ;
    var buyAvg = buyAmount/buyQty ;
    data = {'buyAvg':buyAvg, 'buyAmount':buyAmount, 'buyQty':buyQty, 'lastQty':qty, 'lastPrice':price} ;
  } else if(tradeType=="Sell"){
    var sellQty = (a.sellQty + qty) ;
    var sellAmount = a.sellAmount + (qty*price) ;
    var sellAvg = sellAmount/sellQty ;
    data = {'sellAvg':sellAvg, 'sellAmount':sellAmount, 'sellQty':sellQty, 'lastQty':qty, 'lastPrice':price} ;
  }
  sdata = { 'qty': qty, 'date': date, 'tradeType': tradeType, 'price': price } ;
  return [data,sdata]
}



var tData = {};

function sumryTData(k) {
	var po = "";
	if((Object.keys(tData)).includes(k)){
		console.log("Data from cached store");
		tData[k].forEach(function(doc) {
			po += sumryTrade(doc.data())
		});
		return po;
	}
	else{
		myFunction7(k,true);
		return "";
	}
}

function myFunction7(fuid,shw) {
  var par = db.collection('main/'+funquid+'/trade/'+fuid+'/tdetail')
      par.get()
      .then(function(querySnapshot) {
				tData[fuid] = querySnapshot
				if(shw){querySnapshot.forEach(function(doc) { $(".category-wrap").append(sumryTrade(doc.data()))});	};
			})
      .catch(function(error) {console.log("Error getting documents: ", error);});
}

var j = {date: "12/12/2018", price: 12.12, qty: 12, tradeType: "Buy"}

function sumryTrade(k){
	var bda = "-";
	var sda = "-";
	var bpr = "-";
	var spr = "-";
	if(k.tradeType=="Buy"){bda=k.date; bpr=k.price+" /-" }else{sda=k.date; spr=k.price+" /-"}
	var tempHtm = '<div class="tdetail"><div class="tqty">'+k.qty+'</div><div class="tdate">'+bda+'</div><div class="tpar">'+bpr+'</div><div class="tpar">'+spr+'</div><div class="tdate">'+sda+'</div></div>'
	return tempHtm;
};
















});
