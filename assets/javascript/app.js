//Initialize Firebase
var config = {
    apiKey: "AIzaSyDzLcjaBhoS9toh15ve8aFzUOuz2071bYQ",
    authDomain: "fire-3dad0.firebaseapp.com",
    databaseURL: "https://fire-3dad0.firebaseio.com",
    storageBucket: "fire-3dad0.appspot.com",
    messagingSenderId: "831383773504"
  };
  firebase.initializeApp(config);

  var ignore = true;

  var database = firebase.database();

  var connectionsRef = database.ref("/connections");

	var connectedRef = database.ref(".info/connected");

	connectedRef.on("value", function(snap) {

  if (snap.val()) {

    
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }

  console.log(connectionsRef);
});

 //create onclick event function for formSubmit button

  	$("#formSubmit").on("click", function(event) {
  		event.preventDefault();
  	
  	var name = $("#nameOfTrain").val().trim();
  	var dest = $("#trainDest").val().trim();
  	var first = $("#firstTrain").val().trim();
  	var freq = $("#trainFreq").val().trim();

//create object to store values that can be pushed to Firebase
  	var obj = {
  		name: name,
  		dest: dest,
  		first: first,
  		freq: freq
  	}

  	ignore = false;

//push object to Firebase
  	database.ref().push(obj);
//console log all the values of the object
  	console.log(obj.name);
  	console.log(obj.dest);
  	console.log(obj.first);
  	console.log(obj.freq);
/* create an alert that will run after all the values have been 
processed when the submit button is pressed */
 	alert("Train Successfully Added");

 	$("#nameOfTrain").val("");
 	$("#trainDest").val("");
 	$("#firstTrain").val("");
 	$("#trainFreq").val("");

 	
//prevent moving to a new page
 	return false;
  })

  	database.ref().on("child_added", function(childSnapshot) {

  		
  		if(ignore === false){

  		var tName = childSnapshot.val().name;
  		var tDest = childSnapshot.val().dest;
  		var tFirst = childSnapshot.val().first;
  		var tFreq = childSnapshot.val().freq;

  		// where looking for next arrival and minutes away

  		console.log(tName);
  		console.log(tDest);
  		console.log(tFirst);
  		console.log(tFreq);

  		var timeFormat = moment(tFirst, "hh:mm").subtract(1, "years");
  		var timeDiff = moment().diff(timeFormat, "minutes");
  		var timeRemainder = timeDiff % tFreq;

  		// minutes until the next train
  		var timeRemaining = tFreq - timeRemainder;


  		// next arrival time
  		var nextTrain = moment().add(timeRemaining, "minutes");
  		nextTrain = moment(nextTrain).format("hh:mm")
  		console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));




  		console.log(timeFormat);
  		console.log(timeDiff);
  		console.log(timeRemainder);
  		console.log('minutes until the next train ' + timeRemaining);
  		console.log(nextTrain);


  		$(".table").append("<tr><td>" + tName + "</td><td>" + tDest + "</td><td>" + tFreq + 
  			"</td><td>" + nextTrain + "</td><td>" + timeRemaining + "</td></tr>");

  	}

  	});