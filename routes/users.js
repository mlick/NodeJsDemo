var express = require('express');
var router = express.Router();
var UserLoginModel = require('../models/user')


router.post('/login', function (req, res) {
    var userName = req.body.name;//req.param('name')
    var password = req.body.pwd;//req.param('pwd')

    var quare = {name: userName}
    UserLoginModel.findOne(quare, function (err, model) {
        var messageInfo = "登陆成功";
        var result = 0;
        if (err) {
            console.log(model.toString())
            messageInfo = "登录失败" + err.toString();
            result = -1;
        } else if (model == null) {
            messageInfo = "用户不存在"
            result = -2
        } else if (model != null) {
            if (password != model.pwd) {
                messageInfo = "账号名或者密码错误"
                result = -3
            }
            console.log(model.toString())
        }
        res.send({"result": result, "message": messageInfo});
    })

    //res.json({"result": 0, "message": "success"});
});

router.post('/register', function (req, res) {
    var userName
    var password
    //userName = req.param('name')
    //password = req.param('pwd')
    userName = req.body.name;//req.param('name')
    password = req.body.pwd;//req.param('pwd')

    // Pass 该方法不行
    //var userRegisterObj = req.body.user;
    //userName = userRegisterObj.name;
    //password = userRegisterObj.pwd;

    // Pass 该方法不行
    //var userName = req.params.name;
    //var password = req.params.pwd;

    var quare = {name: userName}
    UserLoginModel.findOne(quare, function (err, model) {
        if (err) {
            res.send({"result": -1, "message": "服务器异常"})
        } else if (model != null) {
            res.send({"result": 1, "message": "该用户名已经被注册"})
        } else {
            new UserLoginModel({
                name: userName,
                pwd: password
            }).save(function (err, user) {
                var message = '注册成功'
                var result = 0
                if (err) {
                    result = -1
                    message = '注册失败'
                }
                console.log(user.toString());
                res.send({"result": result, "message": message})
            })
        }
    })
    //res.send({"result": 0, "message": " " + userName + "  " + password});
    //res.json({"result": 0, "message": "success"});
});

router.get("/info", function (req, res) {
    //res.send("user_info");
    res.json({"result": 0, "message": "success"});
});

module.exports = router;
