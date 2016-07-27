/**
 * Created by Administrator on 2016/7/22.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

    res.json({"data": 'ATSERTQE@#%DGG', "result": 0})
});

module.exports = router;