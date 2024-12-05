var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chartsRouter = require('./routes/charts');

// Importer le module mongoose
var mongoose = require('mongoose');

// Connexion à MongoDB avec gestion des erreurs
var mongoDB = 'mongodb://127.0.0.1/my_database';

// Vérification de la connexion avant d'en établir une nouvelle


// Obtenir la connexion par défaut
var db = mongoose.connection;

// Vérification de la connexion
db.on('error', function(err) {
  console.error('Erreur de connexion à MongoDB:', err);
});
db.once('open', function() {
  console.log('Connexion à MongoDB réussie');
});

var app = express();

// Configuration du moteur de vues (pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Définition des routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', chartsRouter);

// Gestion des erreurs 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Gestionnaire d'erreurs
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (req.app.get('env') === 'development') {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    res.status(err.status || 500).render('error');
  }
});

module.exports = app;
