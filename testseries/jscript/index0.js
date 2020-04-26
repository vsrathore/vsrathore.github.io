var firebaseConfig = {
  apiKey: "AIzaSyBwA_r-AEJ2ICrATdvIT3YeJoMvdj5gYu4",
  authDomain: "testproject-cc6fa.firebaseapp.com",
  databaseURL: "https://testproject-cc6fa.firebaseio.com",
  projectId: "testproject-cc6fa",
  storageBucket: "testproject-cc6fa.appspot.com",
  messagingSenderId: "425151846887",
  appId: "1:425151846887:web:fbde71aec1284f3cf88542",
  measurementId: "G-WCTESKHS4V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


  var db = firebase.firestore();





let globalData = {}
let localData = {}



firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    globalData.user = user
    console.log('Logged In :',user.uid);
    setTemplate('viewTemplate','dashboard')
  } else {
    console.log('User not logged in');
    setTemplate('viewTemplate','login')
  }
});



// if (firebase.auth().currentUser) {
//   setTemplate('viewTemplate','homePage')
// }



count = 0

function setTemplate(id,templateName) {
  count += 1
  console.log(count,templateName);

  // $('#viewTemplate').load('view/loginPage.html');
  //

  let tempHtml = getTemplate(templateName)
  let elm = document.getElementById(id);
  elm.innerHTML = tempHtml();
  localData[templateName].intiFun();
}



function getTemplate(templateName) {
  let templates = {
    'login': createLoginPage,
    'dashboard': createDashboardPage,
    'homePage': createHomePage,
    'testPaper': createTestPaper,
  }
  return templates[templateName]
}


function btnClick(templateName,funId,param) {
  localData[templateName][funId](param);
}




function createLoginPage() {
  localData = {'login':{}}
  let tempHtml = `
    <div class="pageBackground">
      <div class="pageBox loginBox">
        <h2>Login Page</h2>
        <input type="text" id="f22" placeholder="UserID" value="vishan@gmail.com">
        <input type="text" id="f23" placeholder="Password" value="0987654">
        <br><br>
        <button class="submit" onclick="btnClick('login','login')">LogIn</button>
      </div>
    </div>
  `

  localData.login.intiFun = function() {
    console.log('LoginPage init function');
  };

  localData.login.login = function(){
    console.log('Logging In');
    let em = document.getElementById("f22").value;
    let pas = document.getElementById("f23").value;
    firebase.auth().signInWithEmailAndPassword(em, pas)
    .then(function(k){
      console.log("LogIn successful, rediecting to HomePage");
    })
    .catch(function(error) {
      console.log(error);
    });
  };


  return tempHtml;

};



function createDashboardPage() {
  localData = {'dashboard':{}}
  let tempHtml = `
    <div class="pageBackground">
      <div class="pageBox loginBox">
        <h2>Student Home Page:</h2>
        <button class="submit" onclick="btnClick('dashboard','testPaper')">TestPaper</button>
        <button class="submit" onclick="btnClick('dashboard','profile')">Profile</button>
        <button class="submit" onclick="btnClick('dashboard','progress')">Progress</button>
        <button class="submit" onclick="btnClick('dashboard','logout')">Logout</button>
      </div>
    </div>
  `

  localData.dashboard.intiFun = function() {
    console.log('dashboard');
  };


  localData.dashboard.logout = function(){
    console.log('logOut');
    firebase.auth().signOut().then(function() {
      console.log("Log-out successful, rediecting to HomePage");
    }).catch(function(error) {
      console.log("An error happened.");
    });
  };

  localData.dashboard.testPaper = function() {
    setTemplate('viewTemplate','examPage')
  }

  localData.dashboard.profile = function() {
    setTemplate('viewTemplate','examPage')
  }

  localData.dashboard.progress = function() {
    setTemplate('viewTemplate','examPage')
  }


    // for (each of document.getElementsByClassName('submit')){
    //     if(each.classList.contains('mainClass')){
    //       each.classList.remove('mainClass')
    //     }else{
    //       each.classList.add('mainClass')
    //     }
    // }

  return tempHtml;

}

function createExamPage() {
  localData = {'examPage':{}}
  let tempHtml = `
    <div class="pageBackground">
      <div class="header">
        <h3>UserName</h3>
        <div class="buttons">
          <button onclick="btnClick('examPage','testPaper')">TestPaper</button>
          <button onclick="btnClick('examPage','profile')">Profile</button>
          <button onclick="btnClick('examPage','progress')">Progress</button>
          <button onclick="btnClick('examPage','logout')">Logout</button>
        </div>
      </div>
      <div id="outputHomePage"></div>
    </div>
  `

  localData.examPage.intiFun = function() {
    console.log('examPage');
  };


  localData.examPage.logout = function(){
    console.log('logOut');
    firebase.auth().signOut().then(function() {
      console.log("Log-out successful, rediecting to HomePage");
    }).catch(function(error) {
      console.log("An error happened.");
    });
  };

  localData.examPage.testPaper = function() {
    setTemplate("outputHomePage",'testPaper')
  }

  localData.examPage.profile = function() {
    setTemplate('viewTemplate','examPage')
  }

  localData.examPage.progress = function() {
    setTemplate('viewTemplate','examPage')
  }



  return tempHtml;

}




function createHomePage() {
  localData = {'homePage':{}}
  let tempHtml = `

  <div class="pageBackground">
    <div class="pageBox loginBox">
      <h2>Student Home Page:</h2>
      <button class="submit" onclick="btnClick('homePage','testPaper')">TestPaper</button>
      <button class="submit" onclick="btnClick('homePage','profile')">Profile</button>
      <button class="submit" onclick="btnClick('homePage','progress')">Progress</button>
      <button class="submit" onclick="btnClick('homePage','logout')">Logout</button>
    </div>
  </div>



  `
  // <h2>Student Home Page:</h2>
  // <div>
  //   <button onclick="btnClick('homePage','testPaper')">TestPaper</button>
  //   <button onclick="btnClick('homePage','profile')">Profile</button>
  //   <button onclick="btnClick('homePage','progress')">Progress</button>
  //   <button onclick="btnClick('homePage','logout')">Logout</button>
  // </div>
  // <br>
  // <div id="outputHomePage" ng-bind-html="output"></div>

  localData.homePage.intiFun = function() {
    console.log('HomePage');
  };


  localData.homePage.logout = function(){
    console.log('logOut');
    firebase.auth().signOut().then(function() {
      console.log("Log-out successful, rediecting to HomePage");
    }).catch(function(error) {
      console.log("An error happened.");
    });
  };

  localData.homePage.testPaper = function() {
    setTemplate("outputHomePage",'testPaper')
  }


  localData.homePage.progress = function() {
    for (each of document.getElementsByClassName('submit')){
        if(each.classList.contains('mainClass')){
          each.classList.remove('mainClass')
        }else{
          each.classList.add('mainClass')
        }
    }
  }



  return tempHtml;

};




function createTestPaper() {
  localData.testPaper = {}
  let tempHtml = `
      <div class="latestTest">
        <span>Latest Test Paper</span>
        <button onclick="btnClick('testPaper','latestTestPaper')">Start</button>
      </div>
      <hr>
      <span>Old Test Papers</span>
      <div class="repeatOldTest">
        <div class="oldTest">
          <span>Test date</span>
          <button onclick="btnClick('testPaper','oldTest',{'id','oldTestId'})">View Details</button>
        </div>
      </div>
  `
  localData.testPaper.intiFun = function() {
    console.log('TestPaper');
  };

  return tempHtml;
};


function latestTestPaper() {
  localData.latestTestPaper = {}
  kk = ''
  index = 1
  for (each of Object.keys(quesJson)){
      ll = `
          <div class="question" id="question_`+each+`">
            <div class="qtext">Question `+index+` : `+quesJson[each]["ques"]+`</div>
            <div>
              <label> A) `+quesJson[each]["options"]["a"]+` <input type="radio" name="`+each+`" value="a"> </label>
              <label> B) `+quesJson[each]["options"]["b"]+` <input type="radio" name="`+each+`" value="b"> </label>
              <label> C) `+quesJson[each]["options"]["c"]+` <input type="radio" name="`+each+`" value="c"> </label>
              <label> D) `+quesJson[each]["options"]["d"]+` <input type="radio" name="`+each+`" value="d"> </label>
            </div>
          </div>
      `
      index += 1
      kk = kk+ll
  }

  let tempHtml = `
    <h3>Latest Test</h3>
    <div id="livetestpaper">
      <!--
      // <div class="question">
      //   <div>Question 1</div>
      //   <label> Option1 <input type="radio" name="question1" value="Option1"> </label>
      //   <label> Option2 <input type="radio" name="question1" value="Option2"> </label>
      //   <label> Option3 <input type="radio" name="question1" value="Option4"> </label>
      //   <label> Option4 <input type="radio" name="question1" value="Option3"> </label>
      // </div>
       -->

      `+kk+`
    </div>

    <button onclick="cancel()">Reset Test</button>
    <button onclick="review()">Review</button>
    <button onclick="submit()">Submit Test</button>
  `

}


// function createDemoPage() {
//   localData = {}
//   let tempHtml = ``
//
//   function intiFun() {
//     console.log('DemoPage');
//   };
//
//   intiFun();
//   return tempHtml;
//
// };
