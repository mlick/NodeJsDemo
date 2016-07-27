var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var _ = require('underscore')
var serveStatic = require('serve-static')
var MovieModel = require('./models/movie')

var movies = require('./routes/movie');

var mongoose = require('mongoose')
var db = mongoose.connect('mongodb://localhost:27017/ws_data')


db.connection.on('error', function (error) {
    console.log('数据库连接失败：' + error)
})
db.connection.on('open', function () {
    console.log('——数据库连接成功！——')
})

app.set('view engine', 'jade')
app.set('views', './views/pages')
//app.use(express.body.parser())
app.use(bodyParser.urlencoded({extended: true}))

//app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(express.static(path.join(__dirname, 'public'))); //设置静态文件目录
app.use(serveStatic('bower_components'))

app.use('/file', require('./routes/files'))
app.use('/phone', movies)
app.use('/phone/user', require('./routes/users'))
app.use('/phone/token', require('./routes/token'))

//var TestSchema = new mongoose.Schema({
//    name: {type: String},
//    age: {type: Number, default: 0},
//    email: {type: String},
//    time: {type: Date, default: Date.now}
//});
//
//var TestModel = db.model("test1", TestSchema); //'test'相当于collection
//
//var TestEntity = new TestModel({
//    name: 'helloworld',
//    age: 28,
//    emial: 'helloworld@qq.com'
//});
//TestEntity.save(function (err, doc) {
//    if (err) {
//        console.log("error :" + err);
//    } else {
//        console.log(doc);
//    }
//});


app.get('/', function (req, res) {
    MovieModel.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('index_movies', {
            title: 'mlick',
            movies: movies
        })
    })
})

//app.get('/movie', function (req, res) {
//    res.render('index_movies', {
//        title: 'mlick',
//        movies: [{
//            title: '机械战警',
//            _id: 1,
//            poster: 'http://img1.gtimg.com/news/pics/hv1/211/82/2089/135858346.png'
//        }, {
//            title: '机械战警',
//            _id: 2,
//            poster: 'http://img1.gtimg.com/news/pics/hv1/211/82/2089/135858346.png'
//        }, {
//            title: '机械战警',
//            _id: 3,
//            poster: 'http://img1.gtimg.com/news/pics/hv1/211/82/2089/135858346.png'
//        }, {
//            title: '机械战警',
//            _id: 4,
//            poster: 'http://img1.gtimg.com/news/pics/hv1/211/82/2089/135858346.png'
//        }, {
//            title: '机械战警',
//            _id: 5,
//            poster: 'http://img1.gtimg.com/news/pics/hv1/211/82/2089/135858346.png'
//        }, {
//            title: '机械战警',
//            _id: 6,
//            poster: 'http://img1.gtimg.com/news/pics/hv1/211/82/2089/135858346.png'
//        }
//        ]
//    })
//})


//detail page
app.get('/detail/:id', function (req, res) {
    var id = req.params.id;
    MovieModel.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'mlick 详情页',
            movie: movie
        })
    })
})

//movie: {
//    title: '机械战警',
//        doctor: '何塞，帕迪里亚',
//        language: '美国',
//        year: '2014',
//        flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
//        summary: '将建军节建军节建军节建军节建军节建军节建军节建军节建军节'
//}
//
app.post('/admin/movie/new', function (req, res) {
    //console.log(req.body);
    console.log(req.body.movie);
    var id = req.body.movie._id;
    //id = req.body.movie.title;
    var movieObj = req.body.movie;
    var _movie;
    if (id !== undefined && id !== "" && id !== null) {
        console.log("undefined");
        MovieModel.findById(id, function (err, movie) {
            if (err) {
                console.log("error :" + err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/detail/' + movie._id);
            });
        });
    } else {
        console.log("defined");
        _movie = new MovieModel({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            year: movieObj.year,
            poster: movieObj.poster,
            flash: movieObj.flash,
            summary: movieObj.summary
        });

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/detail/' + movie._id);
        });
    }
})
//
app.get('/admin', function (req, res) {
    res.render('admin', {
        title: 'mlick 详情页',
        movie: {
            _id: '',
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
})


//admin update movie
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        MovieModel.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'demo1 后台更新页',
                movie: movie
            });
        });
    }
});

//admin delete movie
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if (id) {
        MovieModel.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }

})

//list page
app.get('/admin/list', function (req, res) {
    MovieModel.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'demo1 列表页',
            movies: movies
        });
    });
});

module.exports = app
