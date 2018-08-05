// Initialize Firebase
var config = {
  apiKey: "AIzaSyAlW0b48hfOEH6exrSKNn_a4Em6q0P4JAc",
  authDomain: "train-schedule-cad11.firebaseapp.com",
  databaseURL: "https://train-schedule-cad11.firebaseio.com",
  projectId: "train-schedule-cad11",
  storageBucket: "train-schedule-cad11.appspot.com",
  messagingSenderId: "399524679881"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

// Initial Values
var trainName = " ";
var dest = " ";
var trainTime = " ";
var freq = " ";

// Capture Button Click
$("#submit").on("click", function(event) {
  event.preventDefault();

  trainName = $("#trainName-input").val().trim();
  dest = $("#destination-input").val().trim();
  trainTime = $("#trainTime-input").val().trim();
  freq = $("#frequency-input").val().trim();

  // Code for the push
  dataRef.ref().push({
    name: trainName,
    destination: dest,
    time: trainTime,
    frequency: freq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  resetFields();
});

function resetFields() {
  $("#trainName-input").val("");
  $("#destination-input").val("");
  $("#trainTime-input").val("");
  $("#frequency-input").val("");
}

function calculateTimes(frequency, initialTime) {
  var tFrequency = frequency;

  var firstTime = initialTime;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years"
  );
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  return {
    arrival: moment(nextTrain).format("hh:mm"),
    minutesAway: tMinutesTillTrain
  };
}

dataRef.ref().on(
  "child_added",
  function(childSnapshot) {
    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().frequency);

    var times = calculateTimes(
      childSnapshot.val().frequency,
      childSnapshot.val().time
    );

    // Output to HTML
    $("#train-table").append(
      "<tr><td> " +
        childSnapshot.val().name +
        " </td><td> " +
        childSnapshot.val().destination +
        " </td><td> " +
        childSnapshot.val().frequency +
        " </td><td> " +
        times.arrival +
        "</td><td>  " +
        times.minutesAway +
        "</td></tr>"
    );

});
