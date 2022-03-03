// let ejs = require('ejs');
// const path = require("path");
const moment = require("moment");
moment().format();

const Enterprise = require('../models/Enterprises');
const Payment = require('../models/Payment');
const Pret = require('../models/Pret');


// @descr       Create a payment voucher
// @route       GET /archives/api/v1/pret/:loanId/payment
// @route       GET /archives/api/v1/enterprises/:enterpriseId/payment
// @access      Private / Admin only
exports.identificationHome = (req, res, next) => {
    if (req.query.msg) {
        res.render('identification/home.ejs', msg=req.query.msg);
    }
    
    res.render('identification/home.ejs');
};