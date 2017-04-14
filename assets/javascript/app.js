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
  	var first = moment($("#firstTrain").val().trim(), "HH:mm").subtract(10, "years").format("X");
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
  });

  	//When a new train is added to Firebase, run this function
  	database.ref().on("child_added", function(childSnapshot) {

  		//If the button has been pressed...
  		if(ignore === false){
  		//...grab the object values that were pushed to firebase
  		var tName = childSnapshot.val().name;
  		var tDest = childSnapshot.val().dest;
  		var tFirst = childSnapshot.val().first;
  		var tFreq = childSnapshot.val().freq;

  		var remainder = moment().diff(moment.unix(tFirst), "minutes")%tFreq;
      var minutes = tFreq - remainder;
      var arrival = moment().add(minutes, "m").format("hh:mm A");

      console.log(remainder);
      console.log(minutes);
      console.log(arrival);
  		//Now add all of the updated values to the Train Schedule Table
  		$(".table").append("<tr><td>" + tName + "</td><td>" + tDest + "</td><td>" + tFreq + 
  			"</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");

  	}

  	});