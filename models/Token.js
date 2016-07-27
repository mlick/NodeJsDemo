/**
 * Created by Administrator on 2016/7/22.
 */
var mongoose = require('mongoose')
var TokenSchema = require('../schemas/token')
var Token = mongoose.model('UserToken', TokenSchema)

module.exports = Token