var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


/* GET todo listing. */
router.get("/todos", function(req, res, next) {
  res.json([
    { id: 1, text: "Learn about React", completed: false },
    { id: 2, text: "Meet friend for lunch", completed: false },
    { id: 3, text: "Build really cool to-do app", completed: false }
  ]);
});

module.exports = router;
