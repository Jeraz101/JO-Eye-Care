const express = require("express");
const bodyParser = require("body-parser");


const app = express();

//app.set('view engine', 'ejs'); //basically for ejs

app.use(express.static("public"));/*when our browser makes a get request to our server.
The bootstrap and the css disappears or not incoporated in it. to solve this we need to use a special function of express,
known as app.use(express.static())*/


app.use(bodyParser.urlencoded({extended:true}));//tells our server to use body-parser for post request

app.get("/", function(req, res){

  res.sendFile(__dirname + "/index.html")
})



app.listen(process.env.PORT || 3000, function(){

  console.log("Server started on port 3000");
});
