/**
 * Created by Administrator on 2016/7/22.
 */

var crypto = require('crypto')

crypto.randomBytes(16, function (ex, buf) {
    var token = buf.toString('hex');
    console.log(token);
});


var dateTime = '2016-07-13T10:07:55+08:00'

var dateTimes = dateTime.split('T');

var dateTime1 = dateTimes[0];

var dataTime2 = dateTimes[1].split('+')[0];

console.log(dateTime1 + ' ' + dataTime2);//1468375675000 1468375675000
//dateTime1 = dateTime1.replace(/-/g, '/');
var date = new Date(dateTime1 + ' ' + dataTime2)
var dateInt = date.getTime() / 1000
console.log(dateInt);

console.log(new Date(dateInt * 1000).toLocaleString());