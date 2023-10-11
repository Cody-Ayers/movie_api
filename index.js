const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("common"));
app.use(express.static("public"));

let topMovies = [
  {
    title: "Miracle",
    genre: "Sport/Drama",
    director: "Gavin O'Conner",
  },
  {
    title: "Youngblood",
    genre: "Sport/Drama/Romance",
    director: "Peter Markle",
  },
  {
    title: "Slap Shot",
    genre: "Sport/Comedy",
    director: "George Roy Hill",
  },
  {
    title: "The Proposal",
    genre: "Comedy/Drama",
    director: "Anne Fletcher",
  },
  {
    title: "National Lampoon's Van Wilder",
    genre: "Comedy",
    director: "Walt Becker",
  },
  {
    title: "How the Grinch Stole Christmas",
    genre: "Comedy",
    director: "Ron Howard",
  },
  {
    title: "Home ALone",
    genre: "Comedy",
    director: "Chris Columbus",
  },
  {
    title: "Bad Boys",
    genre: "Action/Comedy",
    director: "Michael Bay",
  },
  {
    title: "Liar Liar",
    genre: "Comedy",
    director: "Tom Shadyac",
  },
  {
    title: "Wedding Crashers",
    genre: "Comedy",
    director: "David Dobkin",
  },
];

//GET requests
app.get("/", (req, res) => {
  res.send("Welcome to Cody's Movie Heaven!");
});

app.get("/topMovies", (req, res) => {
  res.json(topMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error Error, Fix Now!");
});

app.listen(8080, () => {
  console.log("movieAPI is listening on port 8080.");
});
