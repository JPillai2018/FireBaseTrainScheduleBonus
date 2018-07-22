// This is an enhanced version of Basic functionality
// In this version I tried to  add the following features
// 1. Added Update and Delete capability
// 2. For Update and Delete, a row ,ust be selected from the table/grid
// 3. Once row is selected for maintenance, Add button will be disabled and Update/Delete button will be enabled.
// 4. Selected values will be loaded on to the Details window for editing
// 5. Train number is the key. Once selected for modify/delete, Key  will be disabled and cannot be changed.
// 6. After changing, update button should be pressed to update the record
// 7. Update was successful. But I could not get the refreshed data on to the table. I don't know how to trigger the event listener to re-load the entire data.
// 8. Delete is performed by clicking the delete button.
// 9. I could not make refresh after successfully deleting the record.
// 10.A few more enhancements required are validation messages when try to add a  duplicate record.
// 11.Display a message once record is added, modified and deleted.
// 13.I need to check for duplicate record- Idea is to try to find a match with added key (just like we did for Update/Delete search). If found throw an error message and skip addition logic.
// 12.This application refreshes the data on screen every 60 seconds. 
// 13.Any updates or deletes will be reflected immediately or within 60 seconds since last refresh.  
// 14.A few more enhancements are to be done such as
// 15.What if I don't find a match in when I query? 


// Initialize Firebase
var timeInt = 0;
var timecount = 0;
$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyCXYmiPC33RnNfI8Y5wCuLeu424Y1gYyYU",
    authDomain: "fir-trainschedule-84f9d.firebaseapp.com",
    databaseURL: "https://fir-trainschedule-84f9d.firebaseio.com",
    projectId: "fir-trainschedule-84f9d",
    storageBucket: "fir-trainschedule-84f9d.appspot.com",
    messagingSenderId: "1029861737941"
  };
  // Initialize firebase configuration
  firebase.initializeApp(config);

  timeInt = setInterval(refreshData, 30000);
  
  //refreshData();
  // Define firebase datbase
  var database = firebase.database();
  
  //Setting initial button names
  $("#enterTrainBtn").html("Add");
  //$("#deleteTrainBtn").css("display", "none");
  $("#updateTrainBtn").attr("disabled", "disabled");
  $("#deleteTrainBtn").attr("disabled", "disabled");
  
  // Enter new Train Data in to the database
  $('#enterTrainBtn').on("click", function(event) {
    event.preventDefault();
    $(".error").remove();
    // Take user input from Form
    var trainNum = $("#trainNum").val().trim();
    trainNum = toTitleCase(trainNum);
    var trainName = $("#trainName").val().trim();
    trainName = toTitleCase(trainName);
    var destination = $("#trainDestination").val().trim();
    destination = toTitleCase(destination);
    var firstTrain = moment($("#trainFirstStart").val().trim());
    //console.log("First Train1 = " + firstTrain);
    var firstTrain = moment($("#trainFirstStart").val().trim(), "HH:mm").format("HH:mm");
    if ((firstTrain) === "Invalid date"){
      $("#validateMessage").html("Incorrect Time format!!!");
    }
    //console.log("First Train2 = " + firstTrain);
    var frequency = $("#trainFrequency").val().trim();
    //console.log("Input Form Values = " + trainName + " = " + destination + " = " + firstTrain + " = " + frequency);
  
    // Creating local temporary object to hold train data
    var newTrain = {
        num: trainNum,
        name: trainName,
        place: destination,
        ftrain: firstTrain,
        freq: frequency,
        dateadded: firebase.database.ServerValue.TIMESTAMP
      }
      // uploads train data to the database
      //console.log("New Train= " + newTrain);
    database.ref().push(newTrain);
    var rootRef = database.ref();
    //console.log("New Train= " + newTrain.name);
    //console.log("DB ref=" + rootRef.toString());
    // clears all the text-boxes
    $("#trainNum").val("");
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainFirstStart").val("00:00");
    $("#trainFrequency").val("");
    // Prevents moving to new page
    return false;
  });
  
  
  //  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    //console.log("Child Snapshot = " + childSnapshot.val());
    // Now we store the childSnapshot values into a variable
    var trainNum = childSnapshot.val().num;
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var firstTrain = childSnapshot.val().ftrain;
    var frequency = childSnapshot.val().freq;

    // first Train pushed back to make sure it comes before current time
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    var currentTime = moment().format("HH:mm");
    // Calculate the difference between currentTime and First Train Time in minutes.
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    // Find Remainder of the time left after deviding the difference with frequency
    var timeRemainder = timeDiff % frequency;
    // The remainder should be adde to current time (or subtract from frequency) to get the time till next time relative to currenttrain,we store it in a variable
    var minToTrain = frequency - timeRemainder;
    //minToTrain = minToTrain.format("HH:mm");
    // Formatting time to next train in minutes
    var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
    // Dynamically creating a table
    $("#trainTable>tbody").append("<tr><td class='tnum1'>" + trainNum + "</td><td class='tname1'>" + trainName + "</td><td class='tdest1'>" + destination + "</td><td class='tfreq1'>" + frequency + "</td><td class='tarr1'>" + nxTrain + "</td><td>" + minToTrain + "</td></tr>");
     $("#trainTable>tbody").attr({"class": "tablebody "});
  
  });
  
  // Table Row Update Section
  $('#updateTrainBtn').on("click", function() {
    var trainNum = $("#trainNum").val().trim();
    var firebaseRef = firebase.database().ref();
    var query = firebaseRef.orderByChild('num').equalTo(trainNum);
    var trainName = $("#trainName").val().trim();
    trainName = toTitleCase(trainName);
    var destination = $("#trainDestination").val().trim();
    destination = toTitleCase(destination);
    var firstTrain = moment($("#trainFirstStart").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#trainFrequency").val().trim();
    // Locate the correct child based on matching key value. Once we locate the key, we update the data.
    query.once('value', function(snapshot){
      snapshot.forEach(function(child) {
        child.ref.update({name: trainName,
                          place: destination,
                          ftrain: firstTrain,
                          freq: frequency });
        
      });
    })
    // How do i find out if there is no match?
    //database.ref().child(key).remove();  
    $("#trainNum").val("");
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainFirstStart").val("00:00");
    $("#trainFrequency").val("");
    return false;
  });
  // Firebase Eventlistener for Child_Changed
  //  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
  database.ref().on("child_changed", function(childSnapshot) {
    var trainNum = childSnapshot.val().num;
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var firstTrain = childSnapshot.val().ftrain;
    var frequency = childSnapshot.val().freq;
  
    // first Train pushed back to make sure it comes before current time
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    var currentTime = moment().format("HH:mm");
    // Calculate the difference between currentTime and First Train Time in minutes.
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    // Find Remainder of the time left after deviding the difference with frequency
    var timeRemainder = timeDiff % frequency;
    // The remainder should be adde to current time (or subtract from frequency) to get the time till next time relative to currenttrain,we store it in a variable
    var minToTrain = frequency - timeRemainder;
    //minToTrain = minToTrain.format("HH:mm");
    // Formatting time to next train in minutes
    var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
    // Dynamically creating a table

    //firebase.initializeApp();
    
    // var evt = new Event('build');
    // elem.addEventListener('build');
    // elem.dispatchEvent(evt);
    var event = document.createEvent('Event');
    event.initEvent('build', true, true);
    //elem.addEventListener('build', function(e){

    }, false);
    //elem.dispatchEvent(event);
    //console.log("After...");
    // $("#trainTable>tbody").append("<tr><td class='tnum1'>" + trainNum + "</td><td class='tname1'>" + trainName + "</td><td class='tdest1'>" + destination + "</td><td class='tfreq1'>" + frequency + "</td><td class='tarr1'>" + nxTrain + "</td><td>" + minToTrain + "</td></tr>");
    // $("#trainTable>tbody").attr({"class": "tablebody "});

    // Clearinf Form data after update
    // clears all the text-boxes
    $("#trainNum").val("");
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainFirstStart").val("00:00");
    $("#trainFrequency").val("");
    });

  // Table Row Delete Section *************************************************************************************
  $('#deleteTrainBtn').on("click", function() {
    // Take user input
    console.log("I have been clicked for Deletion...");
    var trainNum = $("#trainNum").val().trim();
    var firebaseRef = firebase.database().ref();
    var query = firebaseRef.orderByChild('num').equalTo(trainNum);

    var trainName = $("#trainName").val().trim();
    var destination = $("#trainDestination").val().trim();
    var firstTrain = moment($("#trainFirstStart").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#trainFrequency").val().trim();
    // Locate the correct child based on matching key value. Once we locate the key, we update the data.
    query.once('value', function(snapshot){
      snapshot.forEach(function(child) {
        child.ref.remove();
       
      });
    })
    return false;
  });
  
  
  // Table row selection
  $(document).click(function(){
    $("#trainTable tbody tr").on("click",function(event){
      event.preventDefault();
      var tableRowData = $(this).children("td").map(function(){
        return $(this).text();
      }).get();
  
      $("#trainNum").val(tableRowData[0]);
      $("#trainName").val(tableRowData[1]);
      $("#trainDestination").val(tableRowData[2]);
      //$("#trainFirstStart").val(tableRowData[3]);
      $("#trainFrequency").val(tableRowData[3]);
      $("#operation").text("Maintain Train Details");
      $("#enterTrainBtn").html("Add");
      $("#trainNum").attr("disabled", "disabled");
      $("#enterTrainBtn").attr("disabled", "disabled");
      $("#updateTrainBtn").prop("disabled", false);
      $("#deleteTrainBtn").prop("disabled", false);
      //$("#deleteTrainBtn").css("display", "block");
    });
  });
  
  //Clear Form data
  $("#clearTrainBtn").on("click",function(){
    // clears all the text-boxes
    $("#trainNum").val("");
    $("#trainName").val("");
    $("#trainDestination").val("");
    $("#trainFirstStart").val("");
    $("#trainFrequency").val("");
    $("#enterTrainBtn").html("Add");
    $("#trainNum").prop("disabled", false);
    $("#enterTrainBtn").prop("disabled", false);
    $("#updateTrainBtn").attr("disabled", "disabled");
    $("#deleteTrainBtn").attr("disabled", "disabled");
    $("#operation").text("Add Train Details");
    //$("#deleteTrainBtn").css("display", "none");
  });
  
  // Converting to Title case
  function toTitleCase(str){
    var word = str.split(" ");
    for (var i=0; i < word.length; i++){
        word[i] = word[i].split('');
        word[i][0] = word[i][0].toUpperCase(); 
        word[i] = word[i].join('');
    }
    return word.join(' ');
  }

  function validateForm(f1, f2, f3, f4, f5){
    var firstTrain = $("#trainFirstStart").val().trim();
    var firstTrain = moment($("#trainFirstStart").val().trim(), "HH:mm").format("HH:mm");
    console.log("Validate TIme=" + firstTrain);
    if (isNaN(firstTrain) || firstTrain === ""){
      console.log ("Incorrect Time. 00:00 AM/PM format");
      return false;
    }
    // else{
    //   return true;
    // }
    return true;
  }

  function formatTime(evt, fld){
    var key = window.event ? event.keyCode : event.which; 
    console.log ("Key Code=" + key);
    if (key === 8 || key === 16 || key === 37 || key === 39 || key ===46){
      return true;
    }
    else{
      if (key >= 48 && key <= 57){
        var fldLength = fld.value.length;
        console.log("Fields Value = " + fld.value + " " + fldLength);
        if (fldLength === 2 || fldLength === 2){
          fld.value = fld.value + ":";
          return true;
        }
        return true;
      }
      else {
        return false;
      }
    }
  };


  function refreshData(){
    var firebaseRef = firebase.database().ref();
    firebaseDB = firebase.database().ref();
    firebaseDB.on('value', gotData, errData);
    timecount++;
    console.log("Refreshing....");
  }

function gotData(data){
  //console.log(data.val());
  var trains = data.val();
  var dbKeys = Object.keys(trains);
  
  //console.log("dbKeys = " + dbKeys);
  $("#trainTable tbody tr").remove();

  for (var i = 0; i < dbKeys.length; i++){
    var k = dbKeys[i];
    //console.log("Key = " + k);
    var tNum = trains[k].num;
    var tName = trains[k].name;
    var tDestination = trains[k].place;
    var tFirstTrain = trains[k].ftrain;
    var tFreq = trains[k].freq;
    
    //console.log ("Record-" + i + "= " + k.freq + " Train Num= " + k.num + " Train Name= " + k.name + " Place= " + k.place);
    // Now re-loading the table with refreshed data
        // first Train pushed back to make sure it comes before current time
        var firstTimeConverted = moment(tFirstTrain, "HH:mm");
        var currentTime = moment().format("HH:mm");
        // Calculate the difference between currentTime and First Train Time in minutes.
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
        // Find Remainder of the time left after deviding the difference with frequency
        var timeRemainder = parseFloat(timeDiff) % parseFloat(tFreq);
        // The remainder should be adde to current time (or subtract from frequency) to get the time till next time relative to currenttrain,we store it in a variable
        var minToTrain = parseFloat(tFreq) - parseFloat(timeRemainder);
        //minToTrain = minToTrain.format("HH:mm");
        // Formatting time to next train in minutes
        var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
        // Dynamically creating a table
        $("#trainTable>tbody").append("<tr><td class='tnum1'>" + tNum + "</td><td class='tname1'>" + tName + "</td><td class='tdest1'>" + tDestination + "</td><td class='tfreq1'>" + tFreq + "</td><td class='tarr1'>" + nxTrain + "</td><td>" + minToTrain + "</td></tr>");
        $("#trainTable>tbody").attr({"class": "tablebody "});
        $("#trainNum").val("");
        $("#trainName").val("");
        $("#trainDestination").val("");
        $("#trainFirstStart").val("00:00");
        $("#trainFrequency").val("");
  }
}
  
function errData(err){
  console.log("Error!!!");
  console.log(err);
}

function formatTNum(evt, fld){
  var key = window.event ? event.keyCode : event.which; 
  var chr = String.fromCharCode(key);
  var vld = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  if (vld.indexOf(chr) >= 0){
    return true;
  }
  else{
    var fldLength = fld.value.length;
    fld.value = fld.value.substring(0, fldLength-1);
    return false;
  }
};



















