//Initialize Firebase
var config = {
    apiKey: "AIzaSyDzLcjaBhoS9toh15ve8aFzUOuz2071bYQ",
    authDomain: "fire-3dad0.firebaseapp.com",
    databaseURL: "https://fire-3dad0.firebaseio.com",
    storageBucket: "fire-3dad0.appspot.com",
    messagingSenderId: "831383773504"
  };
  firebase.initializeApp(config);

//Global variable which will act as an on/off switch
  var ignore = true;

  var database = firebase.database();

//Reference for a firebase directory that lists the amount of users connected
  var connectionsRef = database.ref("/connections");
//Reference for a firebase directory that checks if user is connected or not
  var connectedRef = database.ref(".info/connected");

//If a user is connected, push that user to the /connections directory
connectedRef.on("value", function(snap) {

  if (snap.val()) {

    
    var con = connectionsRef.push(true);
    //When a user logs off, remove that user from the /connections directory
    con.onDisconnect().remove();
  }

  console.log(connectionsRef);
});

 //Create onclick event function for formSubmit button

  	$("#formSubmit").on("click", function(event) {
  		event.preventDefault();
  	
  	//Grab the values from the forms that require the upcoming train's info, store
  	//them as variables
  	var name = $("#nameOfTrain").val().trim();
  	var dest = $("#trainDest").val().trim();
  	var first = $("#firstTrain").val().trim();
  	var freq = $("#trainFreq").val().trim();

	//Create object to store values that can be pushed to Firebase, using the values
	//from the form that were grabbed above using their respective variables
  	var obj = {
  		name: name,
  		dest: dest,
  		first: first,
  		freq: freq
  	}
//Ignore = true so this makes sure that ignore = false only when button
//is clicked. Later, an 'if' statement will be used to determine if ignore=false.
  	ignore = false;

//Push object to Firebase
  	database.ref().push(obj);
//console log all the values of the object
  	console.log(obj.name);
  	console.log(obj.dest);
  	console.log(obj.first);
  	console.log(obj.freq);
//Create an alert that will run after all the values have been 
//processed when the submit button is pressed.
 	alert("Train Successfully Added");

//Now empty out the form so that a new train can be added.
 	$("#nameOfTrain").val("");
 	$("#trainDest").val("");
 	$("#firstTrain").val("");
 	$("#trainFreq").val("");

 	
//Prevent moving to a new page
 	return false;
  })

  	//When a new train is added to Firebase, run this function
  	database.ref().on("child_added", function(childSnapshot) {

  		//If the button has been pressed...
  		if(ignore === false){
  		//...grab the object values that were pushed to firebase
  		var tName = childSnapshot.val().name;
  		var tDest = childSnapshot.val().dest;
  		var tFirst = childSnapshot.val().first;
  		var tFreq = childSnapshot.val().freq;

  		// We're looking for next arrival and minutes away

  		console.log(tName);
  		console.log(tDest);
  		console.log(tFirst);
  		console.log(tFreq);
  		//Rewind the clock so that time is looking forward instead of backward
  		var timeFormat = moment(tFirst, "hh:mm").subtract(1, "years");
  		//Figure out the difference in minutes between current time and 1 year ago
  		var timeDiff = moment().diff(timeFormat, "minutes");
  		//Get the remainder of minutes between the timeDiff variable and the tFreq
  		//variable. tFreq sets the pattern of minutes that elap, timeDiff simply
  		//provides a reference point to draw upon. The remainder of both variables
  		//provides a reference point between the current time and the next train.
  		var timeRemainder = timeDiff % tFreq;

  		// Minutes until the next train. Subtract the original time pattern ex. 4 minutes,
  		// from the remainder between the timeDiff and tFreq variable.  
  		var timeRemaining = tFreq - timeRemainder;


  		// Next arrival time. 
  		var nextTrain = moment().add(timeRemaining, "minutes");
  		nextTrain = moment(nextTrain).format("hh:mm")
  		console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



  		//If you are having difficulty understading the math or the concepts behind
  		//it, make sure to use extensive use of the console as it is both your calculator
  		//and your compass. One thing that I noticed is that if the timeRemainder variable
  		//returns a negative number, the console will throw an error, making this application
  		//flawed and will only work when it returns at least the number 0, meaning the train
  		//has just arrived. So don't worry if the math doesn't quite make sense because
  		//I found it only works with larger numbers that were used in the military time
  		//format, as well as with larger numbers used for the frequency in which the train comes.
  		//I will be deploying a much better version of this app by graduation time.
  		console.log(timeFormat);
  		console.log(timeDiff);
  		console.log(timeRemainder);
  		console.log('minutes until the next train ' + timeRemaining);
  		console.log(nextTrain);

  		//Now add all of the updated values to the Train Schedule Table
  		$(".table").append("<tr><td>" + tName + "</td><td>" + tDest + "</td><td>" + tFreq + 
  			"</td><td>" + nextTrain + "</td><td>" + timeRemaining + "</td></tr>");

  	}

  	});