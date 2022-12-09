var express = require('express');
var router = express.Router();
var db = require('../models/database');


router.get('/getSupplier',function(req,res,next){
    let page = req.query.page;
    if(page < 1 || page === undefined) page = 1;
    
    var identifierCode = req.query.identifierCode;
    if(identifierCode != undefined){
        var id = identifierCode.split(":")[0];
        var subId = identifierCode.split(":")[1];
    }
    if(id === undefined){
        //Get all
        var sql = `select * from supplier
                    limit 10 offset (${page}-1)*10;`;
    }else if(id != undefined && subId != undefined){
        //get by id and subid
        var sql = `select b.product_id,b.subproduct_id,b.unit_price,a.*
                    from supplier a
                    join (
                        select supplier_id,product_id,subproduct_id,unit_price from price_quotation where
                        product_id = ${id}
                        and subproduct_id = ${subId}
                    ) b on a.id = b.supplier_id
                    limit 10 offset (${page}-1)*10;`;
    }else{
        res.send("Thiếu tham số identifierCode (Định dạng id:subID)");
    }
    
    db.query(sql, function (err, result) {
        if (err){
            console.log(sql);
            throw err;
        } 
        let data = result.rows;
        res.json({
            page: page,
            idProd: identifierCode,
            data: data
        });
    });
});

module.exports = router;