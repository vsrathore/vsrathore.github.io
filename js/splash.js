/iP/i.test(navigator.userAgent) && $('*').css('cursor', 'pointer');
var myVar

$(document).ready( function() {

	// var config = {
	// 	apiKey: "AIzaSyA_0COsGN9JPcFugKDTP55-gc-KuA3Bmr0",
	// 	authDomain: "nd2nov2017.firebaseapp.com",
	// 	databaseURL: "https://nd2nov2017.firebaseio.com",
	// 	projectId: "nd2nov2017",
	// 	storageBucket: "nd2nov2017.appspot.com",
	// 	messagingSenderId: "925691852945"
	// };
	//
	// firebase.initializeApp(config);

	fireInit();
	// fireLogRedirect("/pro.html");
	var db = firebase.firestore();


	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    window.location.replace("/summary.html");
			console.log('Logged In : '+ user.uid);
			console.log('Uncomment Redirect to /summary.html');
	  } else {
	    console.log('Not Logged in');
	  }
	});









dflt();
function dflt(){
	console.log("Calling dflt");
	$("h4")[0].innerHTML = '<div class="datetime"><div class="day lightSpeedIn animated">Welcome</div><div class="date lightSpeedIn animated">into a new era</div><div class="time lightSpeedIn animated">Portfolio Watcher</div></div>'
	$("body").off("click");
	$("#main").off("click");
	myVar = setInterval(function(){ myTimer() }, 1000);
	clicker('fbtn',logbtn);
	signtxt("New Sign In")
	fbtntxt("Login")
	clicker('smlink',signbtn);
};


// function myFunction3(){
//   console.log('Trying to LogOut');
//   firebase.auth().signOut().then(function() {
//     console.log("Sign-out successful.");
//     // $("#bigOne")[0].innerText = "User logged out";
//   }).catch(function(error) {
//     console.log("An error happened.");
//   });
// };

function myTimer() {
		var e = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"),
					t = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
					a = new Date,
					i = a.getYear();
		1e3 > i && (i += 1900);
		var s = a.getDay(),  n = a.getMonth(),	r = a.getDate();
		10 > r && (r = "0" + r);
		var l = a.getHours(),	c = a.getMinutes(),	h = a.getSeconds(),	o = "AM";
		l >= 12 && (o = "PM"), l > 12 && (l -= 12), 0 == l && (l = 12), 9 >= c && (c = "0" + c), 9 >= h && (h = "0" + h),
		$(".datetime .day").text(e[s]),
		$(".datetime .date").text(t[n] + " " + r + ", " + i),
		$(".datetime .time").text(l + ":" + c + ":" + h + " " + o)
};





// var array_of_functions = [
//     function() { first_function('a string') },
//     function() { second_function('a string') },
//     function() { third_function('a string') },
//     function() { fourth_function('a string') }
// ]
//
// for (i = 0; i < a.length; i++) {
// 	a[i]();
// }

function clicker(id,a){ var j = $("#"+id); j.off("click"); j.click(function(){a();}); }




function logbtn() {
	clearInterval(myVar);
	ihtml = '<input type="text" id="email" placeholder="Email Id"><br><input type="text" id="password" placeholder="Password"><br>'
	$("#h4").animate({'opacity': 0}, 100, function(){	$("#h4")[0].innerHTML=ihtml; $("#h4").animate({'opacity': 1}, 1000);	});
	clicker('fbtn',tlogbtn);
	signtxt("Reset Password");
	clicker('smlink',tforgot);
	fbtntxt("Login");
	$('body').click(function(e) {if("main"==e.target.id){dflt();};});
};



function signbtn(){
	clearInterval(myVar);
	ihtml = '<input type="text" id="user" placeholder="User Name"><br><input type="text" id="email" placeholder="Email Id"><br><input type="text" id="password" placeholder="Password"><br>'
	$("#h4").animate({'opacity': 0}, 100, function(){	$("#h4")[0].innerHTML=ihtml; $("#h4").animate({'opacity': 1}, 1000);	});
	clicker('fbtn',tsignbtn);
	signtxt("Existing User : LogIn");
	clicker('smlink',logbtn);
	fbtntxt("New SignIn");
	$('body').click(function(e) {if("main"==e.target.id){dflt();};});
};

function signtxt(txt) {$(".smlink")[0].innerHTML = txt;};
function fbtntxt(txt) {$("#fbtn")[0].innerHTML = txt;};



function mainbtn(){
	alert("Calling from main()");
	$("#main").off("click");
};


function tlogbtn(){
	if(navigator.onLine){
		console.log('Logging In');
		var em = document.getElementById("email").value;
		var pas = document.getElementById("password").value;
		firebase.auth().signInWithEmailAndPassword(em, pas)
		.then(function(k){	window.location.replace("/summary.html")})
		.catch(function(error) {alert(error);});
	}else{
		alert("Internet connection error");
		console.log("Internet connection error");
	};
};

function tsignbtn(){
	alert("Trying to new sign ")
	// console.log('Creating User');
	var nm = document.getElementById("user").value;
	var em = document.getElementById("email").value;
	var pas = document.getElementById("password").value;

	// var nm="Visha", em="a@a.com", pas="password"

	firebase.auth().createUserWithEmailAndPassword(em, pas)
	.then(function(k){
		k.updateProfile({ displayName: nm, photoURL: "https://exam" });
		basePar(k,"Creating User",nm)
		// window.location.replace("/splash.html");
	})
	.catch(function(error) {
		console.log(error);
	});
};






function tforgot() {


	var par = db.collection('main/5QqzturCR9TEs6zBVMzg7D8GvOA2/trade')
			par.get()
			.then(function(k) {
				console.log(k);
			})
			.catch(function(e) {
				console.log(e);
			})
	// myFunction3();
	// alert("Recover Password Link")
}





function basePar(user,a,j){
  console.log(a);
  db.collection("main").doc(user.uid).set({ name: j, email: user.email })
    .then(function() { console.log("Particular successfully created!"); })
    .catch(function(error) { console.error("Error in creating particular: ", error); });
};












});
