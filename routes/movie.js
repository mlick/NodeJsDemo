/**
 * Created by Administrator on 2016/6/25.
 */
var express = require('express')
var MovieModel = require('../models/movie')
var router = express.Router();


//router.get('/', function (req, res) {
//    res.render("index_movies", {title: 'mlick'});
//});
router.get('/', function (req, res) {
    MovieModel.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.json({"data": movies, "result": 0})
        //res.json(movies);
    })
});


module.exports = router;