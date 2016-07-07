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
    tagline: list,
    claim: null
  });

  newIdea.save(function(err, newIdea){
    if (err) throw err;
    console.log("saved!");
    res.json("success");
  });
});

router.post('/addComment', function(req, res, next){
  console.log(req.body);
  var newComment = {
    commenter: req.body.name,
    text: req.body.comment
  };

  Idea.findOneAndUpdate({_id:req.body.idea}, {$addToSet:{comments:newComment}}, function(err){
    if(err) throw err;
    console.log("saved comment");
    res.status(500);
  });
});

///////////TEST ROUTE//////////
router.get('/testIdea', function(req, res, next) {
  //var testLikers = new Array(Math.Floor(Math.random()*40)+10);
  //console.log(testLikers.length);
  var newIdea = new Idea({
    name: "Test project name",
    creator: "jimbob",
    description: "owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph owiejeowijeowifjewoifj This should be Looking SO LONG paragraph\n is a newLIne woot woot \n nere is a newLIne woot woot \n nere is a newLIne woot woot \n nere is a newLIne woot woot \n nere is a newLIne woot woot \n nere is a newLIne woot woot",

    tagline: "Short and sweet description of your idea/project",
    tags: ["tag1", "tag2", "LevelMoney", "Team Halo", "Alrighty mate"],
    likers: ["celine", "seth", "goteam"],
    claim: null
  });

  newIdea.save(function(err, idea){
    if (err) throw err;
    console.log("saved!");
  });
});

module.exports = router;
