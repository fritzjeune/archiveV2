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
exports.home = (req, res, next) => {
    if (req.query.msg) {
        res.render('index.ejs', msg=req.query.msg);
    }
    
    res.render('index.ejs');
};

exports.services = (req, res) => {

    const username = req.user.username;
    res.render('home.ejs', { user : username });
}

exports.getCredit = async (req, res) => {
    const username = req.user.username;
    const { page = 1, limit = 10 } = req.query;
    const prets = await Pret.find({ loanState: {$ne: 'closed'} })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({path: 'enterprise', select:'nif businessName'})
        .populate({path: 'assuree', select: 'nif surname firstname phone'});
    res.render('credit-home.ejs', {loans : prets, user : username});
}

exports.getSingleCredit = async (req, res) => {
    const username = req.user.username;
    const pret = await Pret.findById(req.params.loanId)
        .populate({path: 'enterprise', select:'nif businessName matriculeONA'})
        .populate({path: 'assuree', select: 'nif surname firstname phone address email matriculeOnaArchive'}); 
        // TODO: verify if the loan exist in database before sending the data
    const payments = await Payment.find({ loanId : pret._id})
    res.render('single-credit.ejs', {loan : pret, user : username, payments : payments, moment: moment});
}

exports.getAddCredit = (req, res) => {
    const username = req.user.username;
    res.render('add-credit.ejs', {user : username})
}

exports.getEnterprises = async (req, res) => {
    const username = req.user.username;

    const { page = 1, limit = 10 } = req.query;
    const enterprises = await Enterprise.aggregate(
        [
            {$match: {}},
            {$lookup: { from: Pret.collection.name, localField: '_id', foreignField: 'enterprise', as: 'loans' }},
            {$match: { loans: { $exists: true, $ne: []}  }}
            // {$match: { $and : [{ loans: { $exists: true, $ne: []}  }, { 'loans.loanState': {$ne: 'closed'}}] }}
    ]
    )
    .limit(limit * 1)
    .skip((page - 1) * limit);
    res.render('credit-enterprise.ejs', {user : username, enterprises : enterprises})
}

exports.getSingleEnterprise = async (req, res) => {
    const username = req.user.username;

    const enterprise = await Enterprise.findById(req.params.enterpriseId);
    const assureeWL = await Pret.find({ enterprise: enterprise._id, loanState: {$ne: 'closed'} })
    .populate({path: 'enterprise', select:'nif businessName'})
    .populate({path: 'assuree', select: 'nif surname firstname phone'})
    .populate({path: 'payments', select: 'issuedDate totalPayment paymentOwner'});
    res.render('single-enterprise.ejs', {user : username, enterprise : enterprise, assurees : assureeWL})
}

exports.postCredit = (req, res) => {
    const username = req.user.username;
    res.redirect('/credit', {user : username})
}

exports.lookupItem = (req, res) => {
    // console.log(req);
    const username = req.user.username;
    res.render('check-credit.ejs', {user : username});
}



