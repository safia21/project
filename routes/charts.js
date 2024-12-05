var express = require('express');
var router = express.Router();
const PostModel = require('../models/blog');
var mongoose = require('mongoose');

// Connexion Mongoose (sans options obsolètes)
mongoose.connect('mongodb://localhost/my_database')
  .then(() => console.log('Connecté à MongoDB'))
  .catch((err) => console.log('Erreur de connexion MongoDB:', err));

/* GET BarChart. */
router.get('/barchart', async function(req, res) {
  try {
    const result = await blogPostData();
    if (!result || !result.month_data || !result.number_of_posts_data) {
      throw new Error('Données manquantes');
    }

    var month_data = result.month_data;
    var number_of_posts_data = result.number_of_posts_data;

    console.log('Données barchart:', month_data, number_of_posts_data);
    res.render('dashboard/barchart', { 
      title: 'My First Bar Chart',
      datai: JSON.stringify(number_of_posts_data),
      labeli: JSON.stringify(month_data)
    });
  } catch (err) {
    console.error('Erreur dans /barchart:', err);
    res.status(500).json({ error: 'Erreur lors du chargement des données du BarChart' });
  }
});

/* GET LineChart. */
router.get('/linechart', async function(req, res) {
  try {
    const result = await blogPostData();
    if (!result || !result.month_data || !result.number_of_posts_data) {
      throw new Error('Données manquantes');
    }

    var month_data = result.month_data;
    var number_of_posts_data = result.number_of_posts_data;

    console.log('Données linechart:', month_data, number_of_posts_data);
    res.render('dashboard/linechart', { 
      title: 'My First Line Chart',
      datai: JSON.stringify(number_of_posts_data),
      labeli: JSON.stringify(month_data)
    });
  } catch (err) {
    console.error('Erreur dans /linechart:', err);
    res.status(500).json({ error: 'Erreur lors du chargement des données du LineChart' });
  }
});

/* GET PieChart. */
router.get('/piechart', async function(req, res) {
  try {
    const result = await PostModel.find({});
    if (!result || result.length === 0) {
      throw new Error('Aucune donnée trouvée dans MongoDB');
    }
    var postData = getPostData(result, ['month', 'number_of_posts']);
    console.log('postData', postData);
    var number_of_posts = getNumber_Of_Posts(postData);
    var post_in_month = getMonth_Of_Posts(postData);

    console.log('piechart data', number_of_posts);
    res.render('dashboard/piechart', { 
      title: 'My First Pie Chart',
      datai: JSON.stringify(number_of_posts),
      labeli: JSON.stringify(post_in_month)
    });
  } catch (err) {
    console.error('Erreur MongoDB:', err);
    res.status(500).json({ error: 'Erreur de récupération des données' });
  }
});

/* GET Doughnut. */
router.get('/doughnut', function(req, res) {
  const data = [65, 59, 20, 81, 56, 55, 40, 62, 85, 76, 65, 81];
  console.log('doughnut data', data);
  res.render('dashboard/doughnut', {
    title: 'My First Doughnut Chart',
    datai: JSON.stringify(data)
  });
});

// Fonction pour extraire les données des posts
function getPostData(obj1, obj2) {
  return obj1.map(function(row) {
    var result = {};
    obj2.forEach(function(key) {
      result[key] = row[key];
    });
    return result;
  });
}

function getNumber_Of_Posts(postData){
  var data = [];
  postData.forEach(function(content){
    if(content.number_of_posts){
      data.push(content.number_of_posts);
    }
  });
  return data;
}

function getMonth_Of_Posts(postData){
  var data = [];
  postData.forEach(function(content){
    if(content.month){
      data.push(content.month);
    }
  });
  return data;
}

// Fonction pour récupérer les données des posts
async function blogPostData() {
  try {
    const postData = await PostModel.find({});
    if (postData && postData.length > 0) {
      return getSomeData(postData);
    } else {
      console.error('Aucune donnée trouvée dans MongoDB');
      throw new Error('Aucune donnée trouvée');
    }
  } catch (err) {
    console.error('Erreur MongoDB:', err);
    throw err;
  }
}

// Fonction pour formater les données
function getSomeData(postData) {
  var month_data = [];
  var number_of_posts_data = [];

  postData.forEach(function(content){
    if(content.month) {
      month_data.push(content.month);
    }
    if(content.number_of_posts) {
      number_of_posts_data.push(content.number_of_posts);
    }
  });

  return {
    month_data: month_data,
    number_of_posts_data: number_of_posts_data
  };
}

module.exports = router;
