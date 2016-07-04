/**
 * Created by Administrator on 2016/6/27.
 */
var mongoose = require('mongoose')
var MoviewSchema = require('../schemas/movie')
var Movie = mongoose.model('MovieModel', MoviewSchema)

module.exports = Movie;