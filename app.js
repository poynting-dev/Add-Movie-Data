//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/movies", {useNewUrlParser: true});

const movieSchema = {
  name: String,
  director: String,
  year: Number,
  rating: Number,
  genre: String,
  description: String
};

const Movie = mongoose.model("Movie", movieSchema);

const moviesample = new Movie({
  name: "Mission Impossible Fallout",
  director: "Christopher McQuarrie",
  year: 2018,
  rating: 8.6,
  genre: "Action, Thriller",
  description: "Mission: Impossible – Fallout is a 2018 American action spy film written, produced, and directed by Christopher McQuarrie. It is the sixth installment in the Mission: Impossible film series, and the second film to be directed by McQuarrie following the 2015 film Rogue Nation, making him the first director to direct more than one film in the franchise."
});

app.get("/", function(req, res) {
  
  Movie.find({}, function(err, movie) {

    if(movie.length == 0) {
      moviesample.save();
      res.redirect("/");

    } else {
      res.render("home", {
        moviesArr: movie
      });
    }
  });    
  
});

app.get("/compose", function(req, res) {
  res.render("compose");
});


app.post("/compose", function(req, res){

  const movie = new Movie({
    name: req.body.moviename,
    director: req.body.director,
    year: req.body.year,
    rating: req.body.rating,
    genre: req.body.genre,
    description: req.body.comment
  });

  movie.save();
  res.redirect("/");

});

//Request Targeting All Movies
app.route("/movies")
      .get(function(req, res) {
            Movie.find(function(err, foundmovies) {
                  if(!err)
                        res.send(foundmovies);
                  else {
                        res.send(err);
                  }
            });
      })
      .post(function(req, res) {
            const movie = new Movie({
              name: req.body.moviename,
              director: req.body.director,
              year: req.body.year,
              rating: req.body.rating,
              genre: req.body.genre,
              description: req.body.comment
            });
            movie.save(function(err) {
                  if(!err)
                        res.send("Successfully added a new movie.");
                  else {
                        res.send(err);
                  }
            });
      });

///////Request Targeting a specific movie

app.route("/movies/:moviesTitle")
      .get(function(req, res) {
            Movie.findOne({name: req.params.moviesTitle}, function(err, foundmovies){
                  if(foundmovies)
                        res.send(foundmovies);
                  else
                        res.send("No Articles matching that title found!");
            })
      });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
