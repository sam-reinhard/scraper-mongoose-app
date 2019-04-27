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

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

                      // Routes

// Scrape for new articles
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

        db.Article.create(result, {new: true}).then(function(dbArticle){
          console.log(dbArticle);
        })
        .catch(function(err){
          console.log(err);
        });
    });

    res.send("Scrape Completed");
  });    
});

// Submit a comment -- Not working, submits a comment to a new collection called comments and there's no association with the article
app.post("/articles/:id", function(req, res){
  console.log("submitting to /articles/" + req.params.id);
  db.Comment.create(req.body)
    .then(function(dbComment){
      return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
    })
    .then(function(data){
      var hbsObject = {
        comments: data
      }
      console.log("should have posted to the database");
      res.render("index", hbsObject);
    })
    .catch(function(err){
      console.log(err);
    });
});

// View comments on an article -- sending back the article object for some reason
app.get("/articles/:id", function(req, res){
  console.log("getting from /articles/" + req.params.id);
  db.Article.findOne({_id: req.params.id})
    .populate("comment")
    .then(function(dbComment){
      res.json(dbComment);
    })
    .catch(function(err){
      console.log(err);
    });
});

// See the articles in the database
app.get("/articles", function(req, res){
  console.log("getting the /articles route");
  db.Article.find({})
    .then(function(data){
      var hbsObject = {
        articles: data
      }
      res.render("index", hbsObject);
    })
    .catch(function(err){
      console.log("just an error");
      console.log(err);
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});