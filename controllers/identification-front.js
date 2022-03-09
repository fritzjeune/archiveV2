// let ejs = require('ejs');
// const path = require("path");
const moment = require("moment");
moment().format();

const Enterprise = require('../models/Enterprises');
const Payment = require('../models/Payment');
const Pret = require('../models/Pret');


// @descr       Get the dashbord of identification service
// @route       GET /identification
// @access      Private / only accredited users
exports.identificationHome = (req, res, next) => {
    if (req.query.msg) {
        res.render('identification/home.ejs', msg=req.query.msg);
    }
    
    res.render('identification/home.ejs');
};

// @descr       Get the dashbord of identification service
// @route       GET /identification/new-assuree
// @access      Private / only accredited users
exports.addAssuree = (req, res, next) => {
    if (req.query.msg) {
        res.render('identification/add-assuree.ejs', msg=req.query.msg);
    }
    
    res.render('identification/add-assuree.ejs');
};

// @descr       Get the dashbord of identification service
// @route       GET /identification/new-assuree
// @access      Private / only accredited users
exports.getAssurees = (req, res, next) => {
    if (req.query.msg) {
        res.render('identification/assurees.ejs', msg=req.query.msg);
    }
    
    res.render('identification/assurees.ejs');
};

// @descr       Get the dashbord of identification service
// @route       GET /identification/new-assuree
// @access      Private / only accredited users
exports.getEnterprisesIdent = (req, res, next) => {
    if (req.query.msg) {
        res.render('identification/enterprises.ejs', msg=req.query.msg);
    }
    
    res.render('identification/enterprises.ejs');
};