/**
 * Created by Administrator on 2016/6/29.
 */
var mongoose = require('mongoose')

var UserLoginSchemas = mongoose.Schema({
    name: String,
    pwd: String,
    mate: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

//UserLoginSchemas.save();

UserLoginSchemas.pre('save', function (next) {
    if (this.isNew) {
        this.mate.createAt = this.mate.updateAt = Date.now()
    } else {
        this.mate.updateAt = Date.now();
    }
    next();
})


module.exports = UserLoginSchemas