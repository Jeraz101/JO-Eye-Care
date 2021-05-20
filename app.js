
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mongoose = require('mongoose')
const ejs = require("ejs");
const bcrypt = require("bcrypt"); //
const saltRounds = 10;


const app = express();


app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

/*
mongoose.connect("mongodb+srv://admin-jeff:sagene04@cluster0.lzeq8.mongodb.net/subscribersDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
})*/
const mongoString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lzeq8.mongodb.net/subscribersDB`


mongoose.connect(mongoString, {useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on("error", function(error) {
  console.log(error)
})

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
})





const subscribeSchema = new mongoose.Schema({

  email: String
});

const signUpSchema = new mongoose.Schema({
  fullName: String,
  email_address: {
    type: String,
    required: [true, "please check your data entry, no email specified!"]
  },

  password: {
    type: String,
    required: [true, "please check your data entry, no password specified!"]
  }

});




const Subscriber = mongoose.model("Subscriber", subscribeSchema)
const SignUp = new mongoose.model("SignUp", signUpSchema)







app.get("/", function(req, res) {

  res.render("home")
});




app.get("/login", function(req, res) {

  res.render("login")

})

app.get("/logout", function(req, res) {

  res.render("login")
})
app.get("/signup", function(req, res) {
  res.render("sign_up")
})






//API
app.get("/subscribe", function(req, res) {

  Subscriber.find({}, function(err, found_subscibers) {
    if (err) {
      res.send(err);

    } else {
      res.send(found_subscibers);
    }
  })

})






app.post("/subscribe", function(req, res) {

  const subscriber = new Subscriber({
    email: req.body.usersEmail
  });
  subscriber.save(function(err){
    if(err){
      console.log(err);
    }else{
        res.redirect("/")

    }
  })
})

app.post("/signup", function(req, res) {


  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const signUp = new SignUp({
      fullName: req.body.fName,
      email_address: req.body.email,
      password: hash

    });
    signUp.save(function(err) {
      if (!err) {
        res.render("login");
      } else {
        console.log(err);

      }
    })
  })


})


app.post("/login", function(req, res) {

  const email = req.body.userEmail;
  const password = req.body.userPassword;


  SignUp.findOne({email_address: email}, function(err, foundUser) {

    if (err) {
      console.log(err);
    } else {
      if (foundUser) { //using our hased password to login
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("home")
          } else {
            res.send("<h1>oops!!! sorry, wrong password. Please check your password and try again.</h1>")
          }
        });
      } else {
        res.send("<h1>ooops! sorry! wrong email, please check your email and login again</h1>")
      }
    }


    })
  });











app.listen(process.env.PORT || 3000, function() {

  console.log("Server started on port 3000");
});
