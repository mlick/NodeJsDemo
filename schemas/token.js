/**
 * Created by Administrator on 2016/7/22.
 */
var mongoose = require('mongoose')

var UserToken = new mongoose.Schema({
    user_id: String,
    token: String
})

UserToken.pre('save', function (next) {
    next();
})

UserToken.static = {
    findUserId: function (id, cb) {
        return this.findOne({user_id: id}).exec(cb)
    }
}