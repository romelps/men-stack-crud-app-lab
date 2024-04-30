const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config()

const morgan = require('morgan');
const methodOverride = require('method-override');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)

const Movie = require('./models/movie.js')

app.use(express.urlencoded({extended: false}))

app.use(methodOverride('_method'))


//home page
app.get('/', (req, res) => {
  res.render("home.ejs");
});

//edit page
app.get('/movies/:movieId/edit', async (req, res) => {
  const foundMovie = await Movie.findById(req.params.movieId)
  res.render('movies/edit.ejs', {
    movie: foundMovie
  })
})

//delete movie entry
app.delete('/movies/:movieId', async (req, res) => {
  await Movie.findByIdAndDelete(req.params.MovieId)
  res.redirect('/movies')
})

//index(list of movies)
app.get('/movies', async (req, res) => {
  const allMovies = await Movie.find();
  res.render('movies/index.ejs', {
    movies: allMovies
  })
})

//still index. posts our list
app.post('/movies', async(req, res) => {
  console.log(req.body);
  await Movie.create(req.body);
  res.redirect('/movies')
})

//actually edits the movie entry
app.put('/movies/:movieId', async (req, res) => {
  await Movie.findByIdAndUpdate(req.params.movieId, req.body)
  res.redirect('/movies')//after update goes back to index
})

//new fav movies
app.get('/movies/new', (req, res) => {
  res.render('movies/new.ejs');
});

//show your movie when clicked on
app.get('/movies/:movieId', async (req, res) => {
  const foundMovie = await Movie.findById(req.params.movieId)
  res.render('movies/reveal.ejs', {
    movie: foundMovie
  })
})

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

app.listen(2500, () => {
  console.log('listening on port 2500');
})