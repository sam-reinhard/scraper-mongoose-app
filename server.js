var mongoose = require("mongoose");
var express = require("express");
var app = express();

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Set handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Routes
app.get("/scrape", function(req, res){
  axios.get("http://www.theonion.com/").then(function(response){
    var $ = cheerio.load(response.data);

    $("article").each(function(i, element){
      var result = {};

      result.title = $(this)
        .children("header")
        .children("h1")
        .text();
      result.link = $(this)
        .children("header")
        .children("h1")
        .children("a")
        .attr("href");
      result.summary = $(this)
        .children(".item__content")
        .children(".excerpt")
        .children("p")
        .text();

        db.Article.create(result).then(function(dbArticle){
          console.log(dbArticle);
        })
        .catch(function(err){
          console.log(err);
        });
    });

    res.send("Scrape Completed");
  });    
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
