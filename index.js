const express = require("express");
  app = express();
  morgan = require("morgan");
  bodyParser = require('body-parser');
  uuid = require('uuid');

  app.use(bodyParser.json());

  app.use(morgan("common"));
  app.use(express.static("public"));

  let users = [
    {
      id: 1,
      name: "Kim",
      favoriteMovies: []
    },
    {
      id: 2,
      name: "Joe",
      favoriteMovies: ["Miracle"]
    }
  ]

let movies = [
  {
    Title: "Miracle",
    Year: "2004",
    Rating: "7.4/10",
    Description: "The true story of Herb Brooks, the player-turned-coach who led the 1980 U.S. Olympic hockey team to victory over the seemingly invincible Soviet squad.",
    Genre: { Name: ["Sport", "Drama"], Description: "Movie about sports mixed with drama." },
    Director: { Name: "Gavin O'Conner", Bio: "Director bios", Birth: "year"},
    ImageURL: "https://example.com/miracle.jpg",
    Featured: true,
  },
  {
    Title: "Youngblood",
    Year: "1986",
    Rating: "6.2/10",
    Description: "A 17 year old farm boy is offered an ice hockey tryout. His brother drives him to Canada. He has fast legs, slow fists, but is chosen. Will he learn to use his fists and play ice hockey the Canuck way? Will he get the coach's cute daughter?",
    Genre: { Name: ["Sport", "Romance", "Drama"], Description: "Movie about sports mixed with drama." },
    Director: { Name: "Peter Markle", Bio: "Director bios", Birth: "year"},
    ImageURL: "https://example.com/youngblood.jpg",
    Featured: false,
  },
  {
    Title: "Slap Shot",
    Genre: { Name: ["Sport","Comedy"], Description: "Movie about sports mixed with comedy!" },
    Year: "1977",
    Rating: "7.3/10",
    Description: "A failing ice hockey team finds success with outrageously violent hockey goonery.",
    Director: { Name: "George Roy Hill", Bio: "Director bios", Birth: "year"},
    ImageURL: "https://example.com/slapshot.jpg",
    Featured: true,
  },
  {
    Title: "The Proposal",
    Genre: { Name: ["Comedy", "Drama"], Description: "Movie with drama and comedy."},
    Year: "2009",
    Rating: "6.7/10",
    Description: "A pushy boss forces her young assistant to marry her in order to keep her visa status in the U.S. and avoid deportation to Canada.",
    Director: { Name: "Anne Fletcher", Bio: "Director bios", Birth: "year"},
    ImageURL: "https://example.com/theproposal.jpg",
    Featured: true,
  },
  {
    Title: "How the Grinch Stole Christmas",
    Genre: { Name: "Comedy", Description: "Comedy movie." },
    Year: "2000",
    Rating: "6.3/10",
    Description: "On the outskirts of Whoville lives a green, revenge-seeking Grinch who plans to ruin Christmas for all of the citizens of the town.",
    Director: { Name: "Ron Howard", Bio: "Director bios", Birth: "year"},
    ImageURL: "https://example.com/howthegrinchstolechristmas.jpg",
    Featured: false,
  },
  {
    Title: "Home Alone",
    Genre: { Name: "Comedy", Description: "Comedy movie." },
    Year: "1990",
    Rating: "7.7/10",
    Description: "An eight-year-old troublemaker, mistakenly left home alone, must defend his home against a pair of burglars on Christmas eve.",
    Director: { Name: "Chris Columbus", Bio: "Director bios", Birth: "year"},
    ImageURL: "https://example.com/homealone.jpg",
    Featured: true,
  },
  {
    Title: "Wedding Crashers",
    Genre: { Name: "Comedy", Description: "Comedy movie." },
    Year: "2005",
    Rating: "7.0/10",
    Description: "John Beckwith and Jeremy Grey, a pair of committed womanizers who sneak into weddings to take advantage of the romantic tinge in the air, find themselves at odds with one another when John meets and falls for Claire Cleary.",
    Director: { Name:"David Dobkin", Bio: "Director bios", Birth: "year"},
    ImageURL: "https://example.com/hweddingcrashers.jpg",
    Featured: false,
  },
];

// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send('users need names')
  }
});

//UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id ==id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user')
  }


});

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id ==id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }


});

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
  
  let user = users.find( user => user.id ==id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user')
  }


});

//DELETE user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  
  let user = users.find( user => user.id ==id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted!`);
  } else {
    res.status(400).send('no such user')
  }


});

// READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ 
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('no such movie');
  }

});

// READ 
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('no such genre');
  }

});

// READ 
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director');
  }

});

app.listen(8080, () => {
  console.log("movieAPI is listening on port 8080.");
});
