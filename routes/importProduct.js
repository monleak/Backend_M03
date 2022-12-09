var express = require('express');
var router = express.Router();
var db = require('../models/database');

router.get('/getHistory',function(req,res,next){
    let page = req.query.page;
    let sql = "select * from supplier limit 10 offset ($1-1)*10;";
    db.query(sql,[page], function (err, result) {
        if (err) throw err;
        res.json(
            result.rows
        );
    });
});
module.exports = router;