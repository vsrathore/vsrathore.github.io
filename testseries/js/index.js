
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


var globalData = {'papers':{}}
globalData.papers.latest = questionPaper //demo paper
globalData.papers.demo = questionPaper





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



function doLogin(){
  loading('show');
  console.log('Logging In');
  var em = document.getElementById("inputEmail").value;
  var pas = document.getElementById("inputPassword").value;
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

function doLogout(){
  loading('show')
  console.log('logOut');
  firebase.auth().signOut().then(function() {
    globalData = {'papers':{}}
    globalData.papers.latest = questionPaper //demo paper
    globalData.papers.demo = questionPaper

    console.log("Log-out successful, rediecting to LoginPage");
    loading('hide')
  }).catch(function(error) {
    console.log("An error happened.");
    loading('hide')
  });
};








function goDashboard(){
  setTemplate('viewTemplate','dashboardPage')
}













function getExamPaperById(examId) {
  loading('show');
  console.log(examId);

    if (examId=='demo') {
      globalData.answerSheet = setAnswerSheet(globalData.papers.demo)
      setPapertoHomePage()
      loading('hide');

    }
    else if (globalData.papers[examId]) {
      globalData.answerSheet = setAnswerSheet(globalData.papers[examId])
      setPapertoHomePage()
      loading('hide');
      console.log("Fetched data from cache.");

    }else{
      var docRef = db.collection("testSeries").doc(examId);
      docRef.get().then(function(doc) {
        if (doc.exists) {
          var quesJson = JSON.parse(doc.data().ques)
          globalData.papers[examId] = quesJson;
          globalData.answerSheet = setAnswerSheet(globalData.papers[examId])
          setPapertoHomePage()
          console.log("Got data successfully.");
        } else { console.log("No such document!"); }
        loading('hide');

      }).catch(function(error) {
        globalData.answerSheet = setAnswerSheet(globalData.papers.demo)
        setPapertoHomePage()
        loading('hide');

        console.log("Error getting document:", error);
      });

    }


}


function setPapertoHomePage() {
  setTemplate('viewTemplate','homePage',function() {
    document.getElementById('navBar').classList.remove('hideNavBar')
    var elm1 = document.getElementById('quesCard')
    elm1.innerHTML = questionHtml(0)

    var elm2 = document.getElementById('quesTable')
    elm2.innerHTML = quesTableHtml()
  })
};














function oldExamFun(){
  loading('show');

  setTemplate('viewTemplate','oldexamPage',function() {
    var elm2 = document.getElementById('oldExam')
    console.log(globalData.oldExamJson);
      if (globalData.oldExamJson) {
        elm2.innerHTML = oldExamPaperHTML(globalData.oldExamJson)
        document.getElementById('navBar').classList.remove('hideNavBar')
        loading('hide');
        console.log("Fetched data from cache.");
      }else{
        var docRef = db.collection("testSeries").doc("oldExamList");
        docRef.get().then(function(doc) {
          if (doc.exists) {
            var oldExamList = JSON.parse(doc.data().oldExamList)
            globalData.oldExamJson = oldExamList;
            console.log(oldExamList);
            elm2.innerHTML = oldExamPaperHTML(oldExamList)
            console.log(globalData.oldExamJson);
            console.log("Got data successfully.");
          } else {
            console.log(doc,"No such document!");
          }
          document.getElementById('navBar').classList.remove('hideNavBar')
          loading('hide');

        }).catch(function(error) {
          elm2.innerHTML = oldExamPaperHTML(oldExamJson)     //this oldExamJson is demo paper saved in Index.html
          document.getElementById('navBar').classList.remove('hideNavBar')
          console.log("Error getting document:", error);
          loading('hide');

        });
      }

    })
};


function oldExamPaperHTML(oldExamJson) {
  var tempHtml = ''
  for (each of Object.keys(oldExamJson)){
    tempHtml += '<option id="'+each+'">'+oldExamJson[each]["name"]+' : '+oldExamJson[each]["dateTime"]+'</option>'
  }
  return tempHtml
}


function startOldPaper() {
  var examId = document.getElementById('oldExam').selectedOptions[0].id
  getExamPaperById(examId)
}




















function setTemplate(id,templateName, callback) {
  console.log(id,templateName);
  document.getElementById('navBar').classList.add('hideNavBar')
  $('#'+id).load('view/'+templateName+'.html', function(){ if (callback) {callback();} });
};



function quesTableHtml() {
  var tempHtml = '';
  for (var i = 0; i < globalData.answerSheet.questions.length; i++) {
    tempHtml += '<div onclick="clickCell('+i+')" class="cells" id="cell_'+i+'">'+(i+1)+'</div>'
  }
  return tempHtml;
}
function clickCell(quesIndex) {
  var elm1 = document.getElementById('quesCard')
  elm1.innerHTML = questionHtml(quesIndex)
  scrollTo(0,0)
}


function previousQues() {
  var elm1 = document.getElementById('quesCard')
  var quesIndex = Number(elm1.firstElementChild.id.split("_")[1])-1
  if (quesIndex>=0) {
    elm1.innerHTML = questionHtml(quesIndex)
  } else {
    console.log('Reached first question');
  }
}


function nextQues() {
  var elm1 = document.getElementById('quesCard')
  var quesIndex = Number(elm1.firstElementChild.id.split("_")[1])+1
  if (quesIndex<globalData.answerSheet.questions.length) {
    elm1.innerHTML = questionHtml(quesIndex)
  } else {
    console.log('Reached last question');
  }
}




function changeOption(selectedOption) {
  var quesIndex = document.getElementsByClassName('quesText')[0].id.split("_")[1]
  var ques = globalData.answerSheet.questions[quesIndex]
  if (ques.iscorrect==null) {
    ques.selected = selectedOption
    document.getElementById('cell_'+quesIndex).classList.add('attempetedCell')
  }

}

function checkQuestionPaper() {
  document.getElementById('quesCard').classList.add('checkedQues')
  for (var i = 0; i < globalData.answerSheet.questions.length; i++) {
    var tempQues = globalData.answerSheet.questions[i]
    if(tempQues.selected==tempQues.correct){
      globalData.answerSheet.questions[i].iscorrect = true
      document.getElementById('cell_'+i).classList.add('correctCell')
      globalData.answerSheet.result.correct += 1;
    }else{
      globalData.answerSheet.questions[i].iscorrect = false
      if (tempQues.selected) {
        document.getElementById('cell_'+i).classList.add('incorrectCell')
        globalData.answerSheet.result.incorrect += 1;
      }else{
        document.getElementById('cell_'+i).classList.add('skippedCell')
        globalData.answerSheet.result.skipped += 1;
      }
    }

  }

  var elm1 = document.getElementById('quesCard')
  var quesIndex = Number(elm1.firstElementChild.id.split("_")[1])
  elm1.innerHTML = questionHtml(quesIndex)
  getResultText(globalData.answerSheet.result)
  document.getElementById('checkQuesBtn').style.display = "none";

}

function getResultText(result) {
  var elm = document.getElementById('resultText')
  var tempHtml = 'Your score is : '+result.correct+' out of '+result.total+'<br> \
                With '+result.incorrect+' incorrect & '+result.skipped+' skipped questions'
  elm.innerHTML = tempHtml
  elm.classList.add('resultText')
}


function isSelected(selected,x) {
  return  selected==x ? 'checked' : ''
}

function isChecked(ques, x) {

  if (ques.iscorrect==null) {
    return '';
  }else if (ques.selected == x) {
    return  ques.iscorrect ? 'correctQues' : 'incorrectQues'
  }else if (ques.correct == x && ques.selected) {
    return  'correctQues'
  }else if (ques.correct == x && !ques.selected) {
    return  'skippedQues'
  }else {return  ''}

}

function questionHtml(quesIndex) {
  var ques = globalData.answerSheet.questions[quesIndex];
  var tempHtml = '\
    <div class="quesText" id="quesIndex_'+quesIndex+'">Question: '+(quesIndex+1)+') '+ques.ques+'</div>\
    <div class="custom-control custom-radio">\
      <input id="option_a" onchange="changeOption(\'a\')" name="quesOptions" type="radio" class="custom-control-input" '+isSelected(ques.selected,"a")+'>\
      <label class="custom-control-label '+isChecked(ques, "a")+' " for="option_a">A)'+ques.options.a+'</label>\
    </div>\
    <div class="custom-control custom-radio">\
      <input id="option_b" onchange="changeOption(\'b\')" name="quesOptions" type="radio" class="custom-control-input" '+isSelected(ques.selected,"b")+'>\
      <label class="custom-control-label '+isChecked(ques, "b")+' " for="option_b">B)'+ques.options.b+'</label>\
    </div>\
    <div class="custom-control custom-radio">\
      <input id="option_c" onchange="changeOption(\'c\')" name="quesOptions" type="radio" class="custom-control-input" '+isSelected(ques.selected,"c")+'>\
      <label class="custom-control-label '+isChecked(ques, "c")+' " for="option_c">C)'+ques.options.c+'</label>\
    </div>\
    <div class="custom-control custom-radio">\
      <input id="option_d" onchange="changeOption(\'d\')" name="quesOptions" type="radio" class="custom-control-input" '+isSelected(ques.selected,"d")+'>\
      <label class="custom-control-label '+isChecked(ques, "d")+' " for="option_d">D)'+ques.options.d+'</label>\
    </div>\
  '
  return tempHtml


}



var modal = document.getElementById("myModal");
function showPopUp(tempHtml) {
  modal.style.display = "block";
  if (tempHtml.bodyHtml) { document.getElementById('modalBody').innerHTML = tempHtml.bodyHtml; }
  if (tempHtml.footerHtml) { document.getElementById('modalFooter').innerHTML = tempHtml.footerHtml; }

}
function closePopUp() { modal.style.display = "none"; }
window.onclick = function(event) { if (event.target == modal) { closePopUp() } }

function loading(showHide) {
  if(showHide=='show'){
    var bodyHtml = '<div id="loading-bar-spinner" class="spinner"><div class="spinner-icon"></div></div> \
    <h2 id="loading-text">Loading Please Wait . . .</h2>'

    showPopUp({bodyHtml:bodyHtml})
  }else if (showHide=='hide') {
    closePopUp()
  }

}
