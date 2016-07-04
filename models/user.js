/**
 * Created by Administrator on 2016/6/29.
 */
var mongoose = require('mongoose')
var UserLoginSchema = require('../schemas/user')
var UserLoginModel = mongoose.model('UserLoginModel', UserLoginSchema);


module.exports = UserLoginModel