/**
 * Created by Administrator on 2016/7/12.
 */
var http = require('http')
var cheerio = require('cheerio')
process.env.UV_THREADPOOL_SIZE = 128;

function filterChapter(html) {
    var $ = cheerio.load(html)
    var chapters = $('.chapter')

    var courseData = []

    chapters.each(function (item) {
        var chapter = $(this)
        var chapterTitle = chapter.find('strong').text();
        var videos = chapter.find('.video').children('li');

        var voidData = {
            chapterTitle: chapterTitle,
            viedos: []
        }

        videos.each(function (item) {
            var voide = $(this).find('.studyvideo')
            var voidesTitle = voide.text()
            var id = voide.attr('href').split('video/')[1]
            voidData.viedos.push({
                title: voidesTitle,
                id: id
            });

        })
        courseData.push(voidData)
    })
    return courseData;
}

function parseCouserData(couserData) {
    couserData.forEach(function (item) {
        console.log(item.chapterTitle + '\n')
        item.viedos.forEach(function (item2) {
            console.log(item2.title + ' 【' + item2.id + '】')
        })
    })

}


// ======================爬慕课网的课程网页  start===============================================
//http.get('http://www.imooc.com/learn/348', function (res) {
//    var html = ''
//    res.on('data', function (data) {
//        html += data;
//    })
//
//    res.on('end', function () {
//        console.log(html)
//        var couserData = filterChapter(html)
//        parseCouserData(couserData)
//    }).on('error', function () {
//        console.log('获取课程数据失败')
//    })
//})
//========================爬慕课网的课程网页 end ==================================

var path = require('path');
var fs = require('fs');
var request = require('request');


function acquireData(data) {
    var $ = cheerio.load(data);  //cheerio解析data

    var meizi = $('.text img').toArray();  //将所有的img放到一个数组中
    console.log(meizi.length);
    var len = meizi.length;

    var folder_exists = fs.existsSync('images/');
    if (folder_exists == false) {
        fs.mkdir('images/', 777, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("creat done!");
            }
        })
    }

    for (var i = 0; i < len; i++) {
        var imgsrc = meizi[i].attribs.src;  //用循环读出数组中每个src地址
        console.log(imgsrc);                //输出地址
        var filename = parseUrlForFileName(imgsrc);  //生成文件名
        downloadImg(imgsrc, filename, function (fname) {
            var filename = fname;
            return function () {
                console.log(filename + ' done');
            }
        });
    }
}
function parseUrlForFileName(address) {
    return path.basename(address);
}

function downloadImg(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
        // console.log('content-length:', res.headers['content-length']);  //图片大小
        if (err) {
            console.log('err: ' + err);
            return false;
        }
        request(uri).pipe(fs.createWriteStream('images/' + filename)).on('close', callback(filename));  //调用request的管道来下载到 images文件夹下
    });
};

var options = {
    url: 'http://jandan.net/ooxx/page-1319',
    method: 'GET',
    charset: "utf-8",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36",
    }
};


// =====================爬妹子网页图 start===============================================
//request(options, function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//        console.log(body);    //返回请求页面的HTML
//        acquireData(body);
//    }
//})
// =====================爬妹子网页图 end===============================================

//http://mlick.github.io
//http://192.168.4.113:4000
var baseMyBlogUrl = 'http://192.168.4.113:4000'

function parseMyDetailBlog(data) {
    var $ = cheerio.load(data);
    var myDetailBlog = $('.post-body').text()
    var myDetailBlogTitle = $('.post-title').text().trim()
    var dateTime = $('time').attr("datetime");

    var dateTimes = dateTime.split('T');

    var dateTime1 = dateTimes[0];

    var dataTime2 = dateTimes[1].split('+')[0];
    var d = new Date(dateTime1 + ' ' + dataTime2);
    console.log(myDetailBlogTitle);
    console.log(d.toLocaleString());
    console.log(myDetailBlog);
}

var basePostData
var sumLenght
var indexNum = 0
var item

function callDetailBlog(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(indexNum + '<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>> ' + sumLenght);
        if (indexNum >= sumLenght || sumLenght == 1) {
            return
        }
        parseMyDetailBlog(body);
        item = basePostData[++indexNum]
        console.log(indexNum + '==========' + item.url);
        request(item.url, callDetailBlog)
    } else if (error != null && error.code == 'ETIMEDOUT') {
        console.log('请求超时');
    } else {
        console.log('请求失败' + error);
    }
}
function sleep(d) {
    for (var t = Date.now(); Date.now() - t <= d;);
}

function reqMyDetailBlog(postData) {
    postData.forEach(function (item) {
        console.log(item.title + ' ' + item.url);
        var req = request(item.url, {
            timeout: 300000,
            maxRedirects: 1000,
            pool: {maxSockets: Infinity},
            strictSSL: false
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('<<<<<<<<<<<<<<<<<<======================================================>>>>>>>>>>>>>>>>>>>>>>');
                parseMyDetailBlog(body);
            } else if (error != null && error.code == 'ETIMEDOUT') {
                console.log('请求超时');
            } else {
                console.log('请求失败' + error);
            }
        })
        req.end()
        //sleep(1000)
    })
    //basePostData = postData
    //sumLenght = postData.length
    //item = postData[indexNum]
    //console.log(indexNum + '==========' + item.url);
    //request(item.url, callDetailBlog)

}

function parseMyBlog(data) {
    var $ = cheerio.load(data);  //cheerio解析data
    //var bodys = $('.post-type-normal article').toArray();
    //for (var i = 0; i < bodys.length; i++){
    //    bodys[i].children(.post-title-link)
    var postData = [];
    var bodys2 = $('.post')
    bodys2.each(function (item) {
        var postChater = $(this)
        var postTitle = postChater.find('.post-title-link')
        var postUrl = postTitle.attr('href');
        var postTitleName = postTitle.text().trim()
        var postContext = postChater.find('.post-body').text()
        var postContextMore = postChater.find('.post-body').find('.post-more-link').text()
        var postContextName = postContext.replace(postContextMore, '').trim()
        postData.push({
            title: postTitleName,
            url: baseMyBlogUrl + postUrl,
            subContext: postContextName
        })
        //console.log(postTitleName + ' ' + baseMyBlogUrl + postUrl + ' ' + postContextName);
    })
    reqMyDetailBlog(postData)
    //postData.forEach()
}

// =====================爬Mlick博客网站 start===============================================
// 循环次数方式
for (var i = 0; i < 5; i++) {
    var myBlogUrl = baseMyBlogUrl;
    if (i > 0) {
        myBlogUrl += '/page/' + i;
    }
    request(myBlogUrl, {
        timeout: 300000,
        maxRedirects: 1000,
        pool: {maxSockets: Infinity}
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);    //返回请求页面的HTML
            parseMyBlog(body);
        } else if (error != null && error.code == 'ETIMEDOUT') {
            console.log('请求超时');
        } else {
            console.log('请求失败' + error);
        }
    })
    //sleep(1000)
}

//递归方式  ===> 有问题
//var pageNum = 0;
//function callBack(error, response, body) {
//    if (!error && response.statusCode == 200) {
//        pageNum++
//        var myBlogUrl = pageNum == 1 ? baseMyBlogUrl : baseMyBlogUrl + '/page/' + pageNum
//        //console.log(body);    //返回请求页面的HTML
//        parseMyBlog(body, myBlogUrl);
//        //console.log(myBlogUrl)
//        request(myBlogUrl, {timeout: 3000}, callBack)
//    } else if (error != null && error.code == 'ETIMEDOUT') {
//        console.log('请求超时');
//    } else {
//        console.log('请求失败');
//    }
//}
//request(baseMyBlogUrl, {timeout: 30000}, callBack)
// =====================爬Mlick博客网站 end===============================================


// 1 Y
// 2 Y
// 3 Y
// 4 N
// 5 Y
// 6 N
// 7 Y
// 8 N
// 9 N
// 10 Y
// 11 Y
// 12 Y
// 13 N
// 14 Y
// 15 N
// 16 N
// 17 Y
// 18 Y
// 19 Y
// 20 Y


