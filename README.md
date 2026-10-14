# Cody's Flix API

A REST API for a movie app, built with Node.js, Express and MongoDB. Users can
sign up, log in, browse movies by title, genre and director, and keep a list of
favorite movies. It's the backend for the
[React client](https://github.com/Cody-Ayers/codysFlix-client) and the
[Angular client](https://github.com/Cody-Ayers/myFlix-Angular-client).

**API documentation:** https://codys-flix-0b23a40a1d0d.herokuapp.com/documentation.html

## Features

- User sign-up with input validation (express-validator) and hashed passwords (bcrypt)
- Login with JSON Web Tokens: passport-local checks the password, passport-jwt protects every other endpoint
- The JWT signing secret comes from an environment variable, and tokens carry only the user's id, username and email
- Favorite movies stored as references to movie documents (Mongoose)
- CORS enabled for the web clients
- Request logging with Morgan

## Endpoints

All endpoints except sign-up and login need an `Authorization: Bearer <token>` header.

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/users` | Sign up |
| POST | `/login` | Log in, returns the user and a token |
| GET | `/movies` | All movies |
| GET | `/movies/:Title` | One movie by title |
| GET | `/movies/genre/:genreName` | Genre name and description |
| GET | `/movies/directors/:directorName` | Director bio, birth and death year |
| GET | `/users` | All users |
| GET | `/users/:Username` | One user |
| PUT | `/users/:Username` | Update a user's details |
| POST | `/users/:Username/movies/:MovieID` | Add a movie to favorites |
| DELETE | `/users/:Username/movies/:MovieID` | Remove a movie from favorites |
| DELETE | `/users/:Username` | Delete an account |

## Tech stack

| Area | Tools |
|---|---|
| Runtime and framework | Node.js 24, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | Passport (local and JWT strategies), jsonwebtoken, bcrypt |
| Validation | express-validator |
| Docs | JSDoc |
| Deployment | Heroku |

## Running locally

```bash
git clone https://github.com/Cody-Ayers/movie_api.git
cd movie_api
npm install
```

Set two environment variables, then start the server:

```bash
export uri_connect="<your MongoDB connection string>"
export JWT_SECRET="$(openssl rand -hex 32)"
npm start
```

The API runs on http://localhost:8080.
