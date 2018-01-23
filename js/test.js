var config = {
	apiKey: "AIzaSyA_0COsGN9JPcFugKDTP55-gc-KuA3Bmr0",
	authDomain: "nd2nov2017.firebaseapp.com",
	databaseURL: "https://nd2nov2017.firebaseio.com",
	projectId: "nd2nov2017",
	storageBucket: "nd2nov2017.appspot.com",
	messagingSenderId: "925691852945"
};

var  fireInitial = firebase.initializeApp(config);

// Return FireBase Initialize
function fireInit(){return fireInitial;};

function fireLog() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// console.log('Logged In : '+ user.uid);
			return user;
		} else { console.log('User not Logged in'); return false; }
	});
};
