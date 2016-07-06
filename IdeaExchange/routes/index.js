var express = require('express');
var router = express.Router();

var ejs = require('ejs');

var Idea = require('../models/idea');


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

router.get('/ideas', function(req, res, next){
  Idea.find(function(err, ideas){
    if (err) throw err;
    res.json(ideas);
  });
});

router.get('/newIdea', function(req, res, next){
  res.render('newIdea');
});

router.post('/newIdea', function (req, res, next){
  var newIdea = new Idea({
    creator: req.body.creator,
    description: req.body.description,
    name: req.body.name,
    tagline: req.body.tagline
  });

  newIdea.save(function(err, idea){
    if (err) throw err;
    console.log("saved!");
    res.json("success");
  });
});

///////////TEST ROUTE//////////
router.get('/testIdea', function(req, res, next) {
  var newIdea = new Idea({
    creator: "jimbob",
    description: "owiejeowijeowifjewoifj",
    name: "testIdea",
    tagline: "short"
  });

  newIdea.save(function(err, idea){
    if (err) throw err;
    console.log("saved!");

  });
});

module.exports = router;
