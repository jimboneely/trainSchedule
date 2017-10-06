  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDLtutvAtqiSAzv2g0vXdLmnQmY1dOaZlg",
    authDomain: "train-aea15.firebaseapp.com",
    databaseURL: "https://train-aea15.firebaseio.com",
    projectId: "train-aea15",
    storageBucket: "",
    messagingSenderId: "74649054358"
  };
  firebase.initializeApp(config);

var trainData = firebase.database();

$("#add").on("click", function() {

  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = $("#first").val().trim();
  var frequency = $("#frequency").val().trim();

  var newTrain = {

    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  trainData.ref().push(newTrain);

  $("#trainName").val("");
  $("#destination").val("");
  $("#first").val("");
  $("#frequency").val("");

  return false;
});

trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

      console.log(childSnapshot.val());

      var tName = childSnapshot.val().name;
      var tDestination = childSnapshot.val().destination;
      var tFrequency = childSnapshot.val().frequency;
      var tFirstTrain = childSnapshot.val().firstTrain;

      var timeArr = tFirstTrain.split(":");
      var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
      var maxMoment = moment.max(moment(), trainTime);
      var tMinutes;
      var tArrival;
      
      //If the first train is later than the current time, sent arrival to the first train time
      if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
      } else {

        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the currrent time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
      }
        console.log("tMinutes:", tMinutes);
        console.log("tArrival:", tArrival);

        // Add each train's data into the table
        $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tMinutes + "</td></tr>");
      });
