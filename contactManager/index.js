
let mainFilter = {}
let mainData = {}
let filterData = {}
let filterRawData = []
let filterCol = []
// let fltr = document.getElementsByName('fltr')
// fltr.forEach(x=>{ x.addEventListener('onkeyup', fltrChanged, false); })

filterData = [
  {Company:'Alfreds Futterkiste',Contact:'Maria Anders',Country:'Germany'},
  {Company:'Centro comercial Moctezuma',Contact:'Francisco Chang',Country:'Mexico'},
  {Company:'Ernst Handel',Contact:'Roland Mendel',Country:'Austria'},
  {Company:'Island Trading',Contact:'Helen Bennett',Country:'UK'},
  {Company:'Laughing Bacchus Winecellars',Contact:'Yoshi Tannamuri',Country:'Canada'},
  {Company:'Magazzini Alimentari Riuniti',Contact:'Giovanni Rovelli',Country:'Italy'},
]




function fltrChanged(a) {
	console.log(a)
  mainFilter[filterRawData.filterColumn[a.filter]] = a.value.toLowerCase()
  // console.log(mainFilter);
  drawTable();

}



function drawTable() {

  let filterColumn  = filterRawData.filterColumn
  var data = filterData.filter(x=>{
    let allTrue = []
	
	for (let y of filterColumn){	
		jj = mainFilter[y]? (x[y] ? x[y].toLowerCase().includes(mainFilter[y]):false) : true 
		allTrue.push(  jj ) 
	}
	//console.log(allTrue)
    return !allTrue.includes(false)
  })
  console.log(data);


  let tableData = `<tr>`
  filterRawData.tableColumn.forEach(x=>{ tableData += `<th>`+x+`</th>` })
  tableData += `</tr>`
  for (var i = 0; i < data.length; i++) {

    tableData +=  `<tr>`
    filterRawData.tableColumn.forEach(x=>{ tableData += `<td>`+data[i][x]+`</td>` })
    tableData += `</tr>`
  }

  document.getElementById('table').innerHTML = tableData

}












function createTable(data){
      let tableData = `<tr>`
  filterRawData.tableColumn.forEach(x=>{ tableData += `<th>`+x+`</th>` })
  tableData += `</tr>`
  for (var i = 0; i < data.length; i++) {

    tableData +=  `<tr>`
    filterRawData.tableColumn.forEach(x=>{ tableData += `<td>`+data[i][x]+`</td>` })
    tableData += `</tr>`
  }

  document.getElementById('table').innerHTML = tableData
}


function getAllData(parms){
    data = filterRawData.processedData
    allData = data
    for (let parm of parms.split(" ")) {
        allData = getEachData(parm, allData)
    }
	createTable(allData)
    
}


function getEachData(parm,data){
    //data = filterRawData.processedData
    allData = []
   
	
    for (let rw of data) {
        if (Object.values(rw).join("___").toLowerCase().includes(parm)){
            allData.push(  rw )
        }
    }
    return allData

    
}











  function addFilterFiles(a) {
    let elm = document.getElementById('filterFiles')
    var node = document.createElement("LI");
    node.innerHTML = `<span onclick="selectFile('`+a+`')" id="`+a+`">`+a+`</span>`
    elm.appendChild(node.children[0])
  }

  function addFilterSheets(a) {
    let elm = document.getElementById('filterSheets')
    elm.innerHTML = '';
    Object.keys(mainData[a]).forEach(x=>{
      var node = document.createElement("LI");
      node.innerHTML = `<span onclick="selectSheet('`+a+'####'+x+`')" id="`+x+`">`+x+`</span>`
      elm.appendChild(node.children[0])
    })

  }


function highLight(id,a) {
  let elm = document.getElementById(id)
  for (var i = 0; i < elm.childElementCount; i++) { elm.children[i].classList.remove('activeFilter') }
  document.getElementById(a).classList.add('activeFilter')
}


function selectFile(a) {
  mainFilter = {}
  highLight('filterFiles',a)
  addFilterSheets(a);
  console.log(mainData[a]);
}



function selectSheet(a) {
  mainFilter = {};

  let sheetId = a.split("####")
  highLight('filterSheets',sheetId[1])

  console.log(sheetId);
  filterData = mainData[sheetId[0]][sheetId[1]]['processedData']
  filterRawData = mainData[sheetId[0]][sheetId[1]]

  let elm = document.getElementById('filterBtns')
  elm.innerHTML = '';
  mainData[sheetId[0]][sheetId[1]]['filterColumn'].forEach((x,index)=>{
    var node = document.createElement("LI");
    node.innerHTML = `<label>`+x+`<input type="text" name="fltr" value="" onkeyup="fltrChanged({filter:`+index+`, value:this.value})"></label>`
    elm.appendChild(node.children[0])
  })





  drawTable()



}








let oFileIn;
  oFileIn = document.getElementById('my_file_input');
  if(oFileIn.addEventListener) { oFileIn.addEventListener('change', filePicked, false); }



// async  function filePicked(oEvent) {
function filePicked(oEvent){

  var oFile = oEvent.target.files[0];
  console.log(oFile);
    if(oFile.name.slice(-3)==="xls"){
      var sFilename = oFile.name.replace(".xls","").toUpperCase()
      readxlsFile({file:oFile, name:sFilename})

    }else if(oFile.name.slice(-3)==="lsx"){
      var sFilename = oFile.name.replace(".xlsx","").toUpperCase()
      readxlsxFile({file:oFile, name:sFilename})

    }else{
      alert("This file is not supported.")
    }


  };


function readxlsxFile(f) {
  var reader = new FileReader();

  reader.onload = function(e) {
    let tempData = {}
    var data = e.target.result;
    var wb = XLSX.read(data, { type: 'binary' });

    wb.SheetNames.forEach(function(sheetName) {
      // Here is your object
      // var XL_row_object = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
      // var json_object = JSON.stringify(XL_row_object);
      // console.log([json_object]);

      var data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {header:1});
      //console.log(data);

      if(data.length){
        // process data
        let processedData = []
        for (let i=2; i < data.length; i++) {
          let temp = {}
          data[1].forEach((x,index)=>{ temp[x] = data[i][index] })
          processedData.push(temp)
        }

        // Select columns on which need to apply
        var filterColumn = []
        data[0].forEach((x,index)=>{ filterColumn.push(data[1][index]) })

        var tableColumn = data[1].filter(x=>{return x})

        tempData[sheetName] = {raw:data, processedData:processedData, filterColumn:filterColumn, tableColumn:tableColumn}
      };


    })
    mainData[f.name] = tempData
    addFilterFiles(f.name)
    console.log(mainData,f.name);

  };

  reader.onerror = function(ex) { alert(ex); console.log(ex); };

  reader.readAsBinaryString(f.file);
};






function readxlsFile(f) {

  var reader = new FileReader();

  // Ready The Event For When A File Gets Selected

  reader.onload = function(e) {
    let tempData = {}
    var data = e.target.result;
    var cfb = XLS.CFB.read(data, {type: 'binary'});
    var wb = XLS.parse_xlscfb(cfb);
    wb.SheetNames.forEach(function(sheetName) {
      var data = XLS.utils.sheet_to_json(wb.Sheets[sheetName], {header:1});
      // data.forEach((indexR, valueR)=>{
        //   var sRow = "<tr>";
        //   data[indexR].forEach((indexC, valueC)=>{ sRow = sRow + "<td>" + valueC + "</td>"; });
        //   sRow = sRow + "</tr>";
        //   console.log(sRow);
        // });


        if(data.length){
          // process data
          let processedData = []
          for (let i=2; i < data.length; i++) {
            let temp = {}
            data[1].forEach((x,index)=>{ temp[x] = data[i][index] })
            processedData.push(temp)
          }

          // Select columns on which need to apply
          var filterColumn = []
          data[0].forEach((x,index)=>{ filterColumn.push(data[1][index]) })

          var tableColumn = data[1].filter(x=>{return x})

          tempData[sheetName] = {raw:data, processedData:processedData, filterColumn:filterColumn, tableColumn:tableColumn}
        };


      });
      mainData[f.name] = tempData
      addFilterFiles(f.name)
      console.log(mainData,f.name);

    };



  // Tell JS To Start Reading The File.. You could delay this if desired
  reader.readAsBinaryString(f.file)


}




// document.getElementById('file-object').addEventListener("change", function(e) {
//         var files = e.target.files,file;
//         if (!files || files.length == 0) return;
//         file = files[0];
//         var fileReader = new FileReader();
//         fileReader.onload = function (e) {
//           var filename = file.name;
//           // call 'xlsx' to read the file
//           var binary = "";
//           var bytes = new Uint8Array(e.target.result);
//           var length = bytes.byteLength;
//           for (var i = 0; i < length; i++) {
//             binary += String.fromCharCode(bytes[i]);
//           }
//           var oFile = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:true});
//           console.log(oFile)
//         };
//         fileReader.readAsArrayBuffer(file);
//       });



function filePickedx(oEvent) {
    // Get The File From The Input
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name.replace(".xls","").toUpperCase()

    console.log(oFile,sFilename);
    // Create A File Reader HTML5
    var reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function(e) {
        var data = e.target.result;
        var cfb = XLS.CFB.read(data, {type: 'binary'});
        var wb = XLS.parse_xlscfb(cfb);
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function(sheetName) {
            // Obtain The Current Row As CSV
            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);
            var data = XLS.utils.sheet_to_json(wb.Sheets[sheetName], {header:1});
            console.log(sheetName,data,[sCSV]);
            // $.each(data, function( indexR, valueR ) {
            //     var sRow = "<tr>";
            //     $.each(data[indexR], function( indexC, valueC ) {
            //         sRow = sRow + "<td>" + valueC + "</td>";
            //     });
            //     sRow = sRow + "</tr>";
            //     $("#my_file_output").append(sRow);
            // });
        });
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
}
