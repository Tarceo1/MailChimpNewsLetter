//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public")); // This lets us use our static items in the public folder
app.use(bodyParser.urlencoded({
  extended: true
})); // We use this to get the data from our inputs

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// ************ Home route Post ***********
app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  var jsonData = JSON.stringify(data);
  var options = {
    url: "https://us7.api.mailchimp.com/3.0/lists/336fe0c9f7",
    method: "POST",
    headers: {
      "Authorization": "Tonez1 a5a34ef82a5b731fafb98bc52d650bed-us7" // Authorization using request basic http autherization for any API
    },
    body: jsonData
  };
  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
      } else {
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
  console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){ // Takes us back to sign up page after failure
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});


// API Key
// a5a34ef82a5b731fafb98bc52d650bed-us7

// List ID
// 336fe0c9f7
