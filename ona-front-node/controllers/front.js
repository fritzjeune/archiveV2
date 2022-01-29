// let ejs = require('ejs');
const path = require("path");



// @descr       Create a payment voucher
// @route       GET /archives/api/v1/pret/:loanId/payment
// @route       GET /archives/api/v1/enterprises/:enterpriseId/payment
// @access      Private / Admin only
exports.home = (req, res, next) => {
    res.render('index.ejs' );
};

exports.login = (req, res) => {
    console.log(req.body);
    res.render('home.ejs');
}

exports.getCredit = (req, res) => {
    // console.log(req);
    res.render('credit-home.ejs');
}

exports.getSingleCredit = (req, res) => {
    // console.log(req);
    res.render('single-credit.ejs');
}

exports.addCredit = (req, res) => {
    // console.log(req);
    res.render('add-credit.ejs');
}

exports.lookupItem = (req, res) => {
    // console.log(req);
    res.render('check-credit.ejs');
}
