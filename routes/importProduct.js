var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/getHistory',function(req,res,next){
    let page = req.query.page;
    if(page < 1 || page === undefined) page = 1;

    let typeTime = req.query.typeTime;
    if(typeTime === "quarter"){
        if(req.query.time != undefined){
            var time = new Date(req.query.time)
            var year = time.getFullYear();
            var quarter = Math.floor((time.getMonth()+1)/3+1);
        }else if(req.query.quarter != undefined && req.query.year != undefined){
            var year = req.query.year;
            var quarter = req.query.quarter;
        }else{
            res.send("Thiếu input!!!!")
        }
    }else if(typeTime != undefined){
        var time = new Date(req.query.time);
    }
    if(typeTime === undefined){
        //Nếu time null thì trả về toàn bộ danh sách
        var sql = `select * from supplier limit 10 offset (${page}-1)*10;`;
    }else if(typeTime === "quarter"){
        //Get dữ liệu theo quý (một quý có 3 tháng)
        var sql = `select * from supplier 
                    where floor(date_part(\'month\',\"createdAt\"::timestamp)/3+1) = ${quarter} 
                    and date_part(\'year\',\"createdAt\"::timestamp) = ${year}
                    limit 10 offset (${page}-1)*10;`
    }else if(typeTime === "day"){
        //Get dữ liệu theo ngày
        var sql = `select * from supplier 
                    where date_part(\'day\',\"createdAt\"::timestamp) = ${time.getDate()}
                    and date_part(\'month\',\"createdAt\"::timestamp) = ${time.getMonth()+1}
                    and date_part(\'year\',\"createdAt\"::timestamp) = ${time.getFullYear()}
                    limit 10 offset (${page}-1)*10;`
    }else if(typeTime === "month"){
        //Get dữ liệu theo tháng
        var sql = `select * from supplier 
                    where date_part(\'month\',\"createdAt\"::timestamp) = ${time.getMonth()+1}
                    and date_part(\'year\',\"createdAt\"::timestamp) = ${time.getFullYear()}
                    limit 10 offset (${page}-1)*10;`
    }else if(typeTime==="year"){
        var sql = `select * from supplier 
                    where date_part(\'year\',\"createdAt\"::timestamp) = ${time.getFullYear()}
                    limit 10 offset (${page}-1)*10;`
    }
    db.query(sql, function (err, result) {
        if (err){
            console.log(sql);
            throw err;
        } 
        let data = result.rows;
        res.json({
            page: page,
            getBy: {typeTime: typeTime,time: time,quarter: quarter,year: year},
            data: data
        });
    });
});
module.exports = router;