/**
 * Created by Administrator on 2016/6/27.
 */

var mongoose = require('mongoose')

var MoviewSchema = new mongoose.Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: String,
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

MoviewSchema.pre('save', function (next) {
    if (this.isNew) {
        this.mate.createAt = this.mate.updateAt = Date.now()
    } else {
        this.mate.updateAt = Date.now();
    }

    next();
})


MoviewSchema.statics = {
    fetch: function (cb) {
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this.findOne({_id: id})
            .exec(cb)
    }
}

module.exports = MoviewSchema;


