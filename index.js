const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfdb', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');

// let allowedOrgins = ['http://localhost:8080', 'http://testsite.com'];

/*app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn't found on the list of allowed origins
      let message = 'The CORS policy for this application doesn't allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));*/

app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

  app.get('/', (req, res) => {
    res.send('Welcome to CodysFlix!');
  });

  app.use(express.static('public'));
// USER 
// CREATE USER
app.post('/users', async (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({Username: req.body.Username}) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        // If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error ' + error);
    });
});

// READ Users
app.get('/users', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ by USERNAME
app.get('/users/:Username',passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// UPDATE by USERNAME
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {

  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission Denied');
  }

  await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) // This line makes sure that the updated document is returned
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }) 

});

// Add movie to users favorites list
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false }), async (req, res) => {

  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission Denied');
  }

  await Users.findOneAndUpdate({ Username: req.params.Username }, { $push: { Favorites: req.params.MovieID }
    },
    { new: true}) //This line makes sure that the updated document is returned
  .then ((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//DELETE movie from users favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false }), async (req, res) => {

  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission Denied');
  }

  await Users.findOneAndUpdate({ Username: req.params.Username }, { $pull: { Favorites: req.params.MovieID }
    },
    { new: true}) //This line makes sure that the updated document is returned
  .then ((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//DELETE user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// MOVIE 

// Return ALL movies to the user
app.get('/movies', passport.authenticate('jwt', {session: false }), async (req, res) => {
  await Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return (title, description, genre, director, imgurl, featured) by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return description about genre by name/title
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false }), async (req, res) => {
  await Movies.findOne({'Genre.Name': req.params.genreName})
  .then((movie) => {
    res.json(movie.Genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Return information about Director (Bio, birthyear, deathyear)
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false }), async (req, res) => {
  await Movies.findOne({'Director.Name': req.params.directorName})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => {
  console.log("movieAPI is listening on port 8080.");
});
