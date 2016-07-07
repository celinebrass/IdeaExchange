var express = require('express');
var router = express.Router();

var ejs = require('ejs');

var Idea = require('../models/idea');


/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

/* Bubble Page, will be transferred to the home page eventually */
router.get('/bubbles', function(req, res, next) {
   res.render('bubbles');
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

router.post('/newIdea/submit', function (req, res, next){
  var list = req.body.tagline.split(',');
  var newIdea = new Idea({
    name: req.body.name,
    description: req.body.description,
    tagline: list
  });

  newIdea.save(function(err, newIdea){
    if (err) throw err;
    console.log("saved!");
    res.json("success");
  });
});

///////////TEST ROUTE//////////
router.get('/testIdea', function(req, res, next) {
  var testLikers = new Array(Math.Floor(Math.random()*40)+10);
  console.log(testLikers.length);
  var newIdea = new Idea({
    creator: "jimbob",
    description: "owiejeowijeowifjewoifj",
    name: "testIdea",
    tagline: "short",
    likers: testLikers
  });

  newIdea.save(function(err, idea){
    if (err) throw err;
    console.log("saved!");
  });
});

module.exports = router;
