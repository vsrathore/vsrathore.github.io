//use this 'ExamId' as unique id for exam when storing exampaper in firestore
// let ExamId = new Date().toJSON().replace(/-|T|\.|Z|\:/g,"")
count = 0


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
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();


let globalData = {'papers':{}}
let localData = {}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    globalData.user = user
    console.log('Logged In :',user.uid);
    setTemplate('viewTemplate','dashboardPage')
  } else {
    console.log('User not logged in');
    setTemplate('viewTemplate','loginPage')
  }
});




function setTemplate(id,templateName, callback) {
  count += 1
  console.log(count,templateName);
  $('#'+id).load('view/'+templateName+'.html', function(){ if (callback) {callback();} });
};





function btnClick(templateName,funName,param) {
  localData[templateName][funName](param);
}

function optionText(op){
    opt = 'a'==op ? 0 :
          'b'==op ? 1 :
          'c'==op ? 2 : 3
  return opt
}




// Login Page button functions
  localData.login = {}
  localData.login.login = function(){
    loading('show')
    console.log('Logging In');
    let em = document.getElementById("f22").value;
    let pas = document.getElementById("f23").value;
    firebase.auth().signInWithEmailAndPassword(em, pas)
    .then(function(k){
      console.log("LogIn successful, rediecting to HomePage");
      loading('hide')
    })
    .catch(function(error) {
      console.log(error);
      loading('hide')
    });
  };

  localData.login.demo = function() {
    getExamPaperById('demo',' Demo Exam')
  }

// Login Page button functions : End


// Dashboard Page button functions : Start
  localData.dashboard = {}
  localData.dashboard.logout = function(){
    console.log('logOut');
    loading('show')
    firebase.auth().signOut().then(function() {
      loading('hide')
      console.log("Log-out successful, rediecting to LoginPage");
    }).catch(function(error) {
      loading('hide')
      console.log("An error happened.");
    });
  };

  localData.dashboard.latestExam = function() {
    getExamPaperById('latest',' Latest Exam')
  }

  localData.dashboard.oldExam = function() {
    console.log('oldExam');
    setTemplate('viewTemplate','homePage',function() {
      let elm1 = document.getElementById('homePageText')
      elm1.innerText += ' Old Exam'

      let elm2 = document.getElementById('examPageOutputBody')
      getOldExamPaper(elm2)

    })
  }


// Dashboard Page button functions : End



// HomePage Page button functions : Start
  localData.homePage = {}
  localData.homePage.dashboard = function() {
    setTemplate('viewTemplate','dashboardPage')
  }
// HomePage Page button functions : End



// latestExamPaper button functions : Start
  localData.latestExamPaper = {}

  localData.latestExamPaper.review = function () {
    let ques = Object.keys(globalData.currentPaper);
    for( each of ques){
      let attempeted = $("input[name="+each+"]:checked")[0]
      if (!attempeted) { $("#question_"+each)[0].classList.add('missedQuestion') }
    }

    let skippedQuestions = $(".question").length - $("input:checked").length    // skippedQuestions = total question - total selected answers
    if (skippedQuestions>0) {
      let tempHtml = `
        <h3 class="reviewText"> You are skipping `+skippedQuestions+` questions . . .<br> Are you sure to submit paper or wants to go back?</h3>
        <div class="latestExamPaperButtons">
          <button onclick="closePopUp()">Go Back</button>
          <button onclick="btnClick('latestExamPaper','submit')">Submit</button>
        </div>
      `
      showPopUp(tempHtml)
    }

  };


  localData.latestExamPaper.submit = function() {
    closePopUp();   //closePopUp

    let answerSheet = {}
    let ques = Object.keys(globalData.currentPaper);
    let score = {'skipped':0, 'correct':0, 'incorrect':0, 'total':ques.length}
    for( each of ques){
      let attempeted = $("input[name="+each+"]:checked")
      let attempetedAnswer = attempeted[0] ? attempeted[0].value : null
      let correctAnswer = globalData.currentPaper[each]['correct']
      answerSheet[each] = {'correct':correctAnswer, 'attempeted':attempetedAnswer}

      let questionElm =  document.getElementById('question_'+each)
      let correctAnswerIndex = optionText(correctAnswer)
      questionElm.classList.remove("missedQuestion")     //remove highlight which added during Review
      questionElm.children[1].children[correctAnswerIndex].classList.add('correct')

      if (attempetedAnswer) {
        let attempetedAnswerIndex = optionText(attempetedAnswer)
        if (attempetedAnswerIndex != correctAnswerIndex) {
          score.incorrect += 1
          questionElm.children[1].children[attempetedAnswerIndex].classList.add('wrong')
          addIcon(questionElm, 'incorrect')
        }else{
          score.correct += 1
          addIcon(questionElm, 'correct')
        }
      }else{
        score.skipped += 1
        addIcon(questionElm, 'skipped')
      };



    }
    // disabled all questions options.
    let finalData = {'score':score, 'answerSheet':answerSheet}
    console.log(finalData);
    $("#livetestpaper :input").hide()

    let answerHtml = `
      <div class="question answerMargin">
        <div class="answertext">
          Your score is : `+score.correct+` out of `+score.total+`<br>
          With `+score.incorrect+` incorrect & `+score.skipped+` skipped questions
        </div>
      </div>
    `
    document.getElementById('examPageOutputHead').innerHTML = answerHtml
    scrollTo(0,0)
// Hide exam paper's buttons; so student can't retry to submit current paper.
    $("#latestExamPaperButtons")[0].style.display = 'None'

  }


// latestExamPaper Page button functions : End



localData.oldExamPaper = {}
localData.oldExamPaper.takeExam = function (examId) {
  console.log(examId);
  getExamPaperById(examId,' Previous Exam')
}



// headerText = ' Latest Exam'
// getLatestExamPaper(elm2)
function getExamPaperById(examId,headerText) {
  loading('show')

  console.log(examId,headerText);
  setTemplate('viewTemplate','homePage',function() {
    let elm1 = document.getElementById('homePageText')
    elm1.innerText += headerText

    let elm2 = document.getElementById('examPageOutputBody')
    if (examId=='demo') {
      elm2.innerHTML = latestExamPaperHTML(quesJson)     //this quesJson is demo paper saved in Index.html
      document.getElementById("homePageButtons").style.display = 'None'
      document.getElementById("resetExamButton").style.display = 'None'
      loading('hide')
    }
    else if (globalData.papers[examId]) {
      elm2.innerHTML = latestExamPaperHTML(globalData.papers[examId])
      console.log("Fetched data from cache.");
      loading('hide');

    }else{
      let docRef = db.collection("exampapers").doc(examId);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          let quesJson = JSON.parse(doc.data().ques)
          globalData.papers[examId] = quesJson;
          elm2.innerHTML = latestExamPaperHTML(quesJson)
          console.log("Got data successfully.");
        } else {
          console.log("No such document!");
        }
        loading('hide')
      }).catch(function(error) {
        elm2.innerHTML = latestExamPaperHTML(quesJson)     //this quesJson is demo paper saved in Index.html
        console.log("Error getting document:", error);
        loading('hide')
      });

    }

  })

}






function latestExamPaperHTML(quesJson) {
  globalData.currentPaper = quesJson
  // console.log(quesJson);
  kk = ''
  index = 1
  for (each of Object.keys(quesJson)){
      ll = `
          <div class="question" id="question_`+each+`">
            <div class="qtext">Question `+index+` : `+quesJson[each]["ques"]+`</div>
            <div name="options">
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
    <div id="livetestpaper" style="text-align: initial;">
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
    <div id="latestExamPaperButtons" class="latestExamPaperButtons">
      <button id="resetExamButton" onclick="btnClick('dashboard','latestExam')">Reset Exam</button>
      <button onclick="btnClick('latestExamPaper','review')">Review</button>
      <button onclick="btnClick('latestExamPaper','submit')">Submit</button>
    </div>

  `
return tempHtml
}





function getOldExamPaper(elm2){
  loading('show')
  if (globalData.oldExamJson) {
    elm2.innerHTML = oldExamPaperHTML(globalData.oldExamJson)
    console.log("Fetched data from cache.");
    loading('hide')
  }else{
    let docRef = db.collection("exampapers").doc("oldExamList");
    docRef.get().then(function(doc) {
      if (doc.exists) {
        let oldExamList = JSON.parse(doc.data().oldExamList)
        globalData.oldExamJson = oldExamList;
        elm2.innerHTML = oldExamPaperHTML(oldExamList)
        console.log("Got data successfully.");
      } else {
        console.log(doc,"No such document!");
      }
      loading('hide')
    }).catch(function(error) {
      elm2.innerHTML = oldExamPaperHTML(oldExamJson)     //this oldExamJson is demo paper saved in Index.html
      console.log("Error getting document:", error);
      loading('hide')
    });

  }
};


function oldExamPaperHTML(oldExamJson) {
  kk = ''
  for (each of Object.keys(oldExamJson)){
      ll = `
        <div class="label">
          <div class="buttons"> <button onclick="btnClick('oldExamPaper','takeExam','`+each+`')">Start Exam</button> </div>
          <div id="oldExamText" class="oldExamText">`+oldExamJson[each]['name']+` : `+oldExamJson[each]['dateTime']+`</div>
        </div>
      `
      kk += ll
  }

  let tempHtml = '<div class="oldExam">'+kk+'</div>'
  return tempHtml
}







var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
function showPopUp(bodyHtml) {
  modal.style.display = "block";
  if (bodyHtml) { document.getElementById('modalBody').innerHTML = bodyHtml; }
}

// When the user clicks on <span> (x), close the modal
function closePopUp() { modal.style.display = "none"; }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) { closePopUp() }
}

function loading(showHide) {
  if(showHide=='show'){
    let bodyHtml = `
    <div id="loading-bar-spinner" class="spinner"><div class="spinner-icon"></div></div>
    <h2 id="loading-text">Loading Please Wait . . .</h2>
    `
    showPopUp(bodyHtml)
  }else if (showHide=='hide') {
    closePopUp()
  }

}



function addIcon(elm, icon) {
  let iconSets ={
    incorrect : `
    <svg class="wrongIcon" viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z" class="wrongIconPath"></path></svg>`,
    correct : `
    <svg class="correctIcon" viewBox="0 0 512 512"><path d="M 256 8 C 119.033 8 8 119.033 8 256 s 111.033 248 248 248 s 248 -111.033 248 -248 S 392.967 8 256 8 Z m 0 48 c 110.532 0 200 89.451 200 200 c 0 110.532 -89.451 200 -200 200 c -110.532 0 -200 -89.451 -200 -200 c 0 -110.532 89.451 -200 200 -200 m 140.204 130.267 l -22.536 -22.718 c -4.667 -4.705 -12.265 -4.736 -16.97 -0.068 L 215.346 303.697 l -59.792 -60.277 c -4.667 -4.705 -12.265 -4.736 -16.97 -0.069 l -22.719 22.536 c -4.705 4.667 -4.736 12.265 -0.068 16.971 l 90.781 91.516 c 4.667 4.705 12.265 4.736 16.97 0.068 l 172.589 -171.204 c 4.704 -4.668 4.734 -12.266 0.067 -16.971 Z" class="correctIconPath"></path></svg> ` ,
    skipped : `
    <svg class="skippedIcon" viewBox="0 0 512 512"><path d="M 192 0 C 86.4 0 0 86.4 0 192 c 0 76.8 25.6 99.2 172.8 310.4 c 4.8 6.4 12 9.6 19.2 9.6 c 7.2 0 14.4 -3.2 19.2 -9.6 C 358.4 291.2 384 268.8 384 192 C 384 86.4 297.6 0 192 0 Z m 0 446.09 c -14.41 -20.56 -27.51 -39.13 -39.41 -56 C 58.35 256.48 48 240.2 48 192 c 0 -79.4 64.6 -144 144 -144 s 144 64.6 144 144 c 0 48.2 -10.35 64.48 -104.59 198.09 c -11.9 16.87 -25 35.44 -39.41 56 Z m 73.54 -316.32 l -11.31 -11.31 c -6.25 -6.25 -16.38 -6.25 -22.63 0 l -39.6 39.6 l -39.6 -39.6 c -6.25 -6.25 -16.38 -6.25 -22.63 0 l -11.31 11.31 c -6.25 6.25 -6.25 16.38 0 22.63 l 39.6 39.6 l -39.6 39.6 c -6.25 6.25 -6.25 16.38 0 22.63 l 11.31 11.31 c 6.25 6.25 16.38 6.25 22.63 0 l 39.6 -39.6 l 39.6 39.6 c 6.25 6.25 16.38 6.25 22.63 0 l 11.31 -11.31 c 6.25 -6.25 6.25 -16.38 0 -22.63 l -39.6 -39.6 l 39.6 -39.6 c 6.25 -6.25 6.25 -16.38 0 -22.63 Z" class="skippedIconPath"></path></svg>`
  }

  let tempSvg = document.createElement('div')
  tempSvg.innerHTML = iconSets[icon].trim()
  elm.insertBefore(tempSvg.firstChild,elm.children[1])
}
