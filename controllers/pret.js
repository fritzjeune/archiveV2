
const Assuree = require('../models/Assurees');
const Pret = require('../models/Pret');
const Enterprise = require('../models/Enterprises');
const Payment = require('../models/Payment');

let today = new Date();
const stampDutypercentage = 2/1000;
const MINIMUM_TERM = 6;
const ANNUAL_INTEREST = 6;

const calculateLoan = async (req, res) => {
    var body = req.body;
    console.log(req.body)
    // find the assuree who make the loan/loaner
    let assuree = await Assuree.findOne({$or: [{nif: body.assuree}, {cin: body.assuree}, {nin: body.assuree}] });
    // TODO find assuree by cin or other id number
    console.log(assuree)
    if (!assuree) {
        return res.status(404).json({
            success: false,
            message: `Assuree with nif ${body.assuree} not found`
        });
    } else {
        // adding the relationship between loan and assuree
        body.assuree = assuree._id;
        let idPart = "";
        if (assuree.nif == "") {
            idPart = assuree.matriculeOnaArchive.split('-').join('');
        } else {
            idPart = assuree.nif.split('-').join('');
        }
        if (!body.issued_date) {
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            if (month < 10) {
                month = `0${month}`;
            }
            body.loanId = `${year}${month}${idPart}`;
        } else {
            // Adding an unique id number for each loan
            let code = body.issued_date.split('-').join('').slice(0, 6);
            body.loanId = `${code}${idPart}`
        }         
        // console.log(req.body.loanId);
    }

    // find the actual enterprise of the assuree/ loaner
    let enterprise = await Enterprise.findOne({ matriculeONA: body.enterprise });
    if (!enterprise) {
        return res.status(404).json({
            success: false,
            message: `Enterprise with nif ${body.assuree} not found`
        });
    } else {
        // adding the relationship between loan and assuree actual enterprise
        body.enterprise = enterprise._id;
    }
    // console.log(req.body.enterprise);

    // Verify if user put the the loanApprouved in the request
    let loanApprouved = parseFloat(parseFloat(body.loanApprouved).toFixed(2));
    if (!loanApprouved || parseFloat(loanApprouved) <= 0) {
        return res.status(403).json({
            success: false,
            message: "Bad request, Please enter the Approuved loan"
        });
    }
    // console.log(loanApprouved);
    // calculate stampduty
    let stamp = body.stampDuty;
    if (!stamp || stamp == "" || parseFloat(stamp) <= 0 ) {
        body.stampDuty = parseFloat((loanApprouved * stampDutypercentage).toFixed(2));
        console.log(body.stampDuty)
    }

    // verify that the user enter a term value
    let term = parseInt(body.term);
    if (!term || !(term >= MINIMUM_TERM)) {
        return res.status(403).json({
            success: false,
            message: "Invalid term value, must be greater than 6"
        });
    }
    // console.log(term);
    

    // calculate 
    let finalInterestRate = term * (ANNUAL_INTEREST / 12);
    let finalAmountLoan = parseFloat((loanApprouved * (1 + (finalInterestRate / 100))).toFixed(2));
    let monthlyRemittance = parseFloat((finalAmountLoan / term).toFixed(2));

    body.finalAmount = finalAmountLoan;
    body.monthlyRemittance = monthlyRemittance;
    body.actualBalance = finalAmountLoan;
    body.totalInterest = parseFloat((finalAmountLoan - loanApprouved).toFixed(2));
    // check if assuree has an active debt
    let passedLoan = await Pret.findOne({
        assuree: assuree._id,
        loanState : { $ne: "closed"}
    });

    if (!body.deducedDebts || !(parseInt(body.deducedDebts) > 0)) {

        if (passedLoan || passedLoan != null) {
            body.deducedDebts = parseFloat(passedLoan.actualBalance.toFixed(2));


            body.passedLoan = passedLoan._id;
            
        } else {
            body.passedLoan = null;
            body.deducedDebts = 0;


        }  
    } else if ( body.deducedDebts > 0 ){
        if (passedLoan || passedLoan != null) {
            body.passedLoan = passedLoan._id;
        } else {
            body.passedLoan = null;
        }
        
    }

    console.log(body.passedLoan);
    // the final amount of the giving loan
    body.CashReceived = parseFloat((loanApprouved - (parseFloat(req.body.stampDuty) + parseFloat(req.body.deducedDebts))).toFixed(2));

    console.log(body)
    return body;
}

// @descr       Add a loan
// @route       GET /archives/api/v1/pret
// @access      Private
exports.createPret = async(req, res, next) => {
    try {

        if (!req.body.assuree || req.body.assuree == '') {
            return res.status(403).json({
                success: false,
                msg: 'Please enter the assuree Nif'
            });
        }

        if (!req.body.loanApprouved || req.body.loanApprouved == '') {
            return res.status(403).json({
                success: false,
                msg: 'Please enter the assuree approuved amount'
            });
        }

        console.log('step1')
        const calculatedPret = await calculateLoan(req, res);
        const passedLoan = calculatedPret.passedLoan;
        console.log('step2')

        if (req.query.calculate) {
            return res.status(200).json({
                success: true,
                data: calculatedPret
            })
        }

        const pret = await Pret.create(calculatedPret);

        if (passedLoan) {
            if (pret.deducedDebts > 0) {
                let paymentObj = {}
                paymentObj.surname = pret.surname;
                paymentObj.firstname = pret.firstname;
                paymentObj.loanId = passedLoan;
                paymentObj.totalPayment = pret.deducedDebts;
                paymentObj.receiptNumber = "AUTO-PAY";
                console.log('step1')
                await Payment.create(paymentObj);
            }
        }

        // console.log(pret);
        res.redirect('/credit/recovery');
        // res.status(200).json({
        //     success: true,
        //     message: "Loan Successfully archived",
        //     data: pret
        // });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
        
    }
};


// @descr       Get all loan by day of mnth
// @route       GET /archives/api/v1/pret/?
// @access      Private
exports.getPret = async(req, res, next) => {
    try {
        console.log(req.query)
        let prets;
        if (req.query.day) {
            prets = await Pret.aggregate(
                [
                    {$addFields: {  "day" : {$dayOfMonth: '$issued_date'}}},
                    {$match: { day: parseInt(req.query.day), loanState: {$in : ['unpaid', 'up-to-date', 'irregular'] }}, },
                    {$lookup: { from: Assuree.collection.name, localField: 'assuree', foreignField: '_id', as: 'assuree' }},
                    {$lookup: { from: Enterprise.collection.name, localField: 'enterprise', foreignField: '_id', as: 'enterprise' }}
                ]
            );
        } else if (req.query.year) {
            prets = await Pret.aggregate(
                [
                    {$addFields: {  "year" : {$year: '$issued_date'}}},
                    {$match: { year: parseInt(req.query.year), loanState: {$in : ['unpaid', 'up-to-date', 'irregular'] }}, },
                    {$lookup: { from: Assuree.collection.name, localField: 'assuree', foreignField: '_id', as: 'assuree' }},
                    {$lookup: { from: Enterprise.collection.name, localField: 'enterprise', foreignField: '_id', as: 'enterprise' }}
                ]
            );
        } else if (req.query.name) {
            prets = await Pret.find({$or:[{surname: new RegExp(req.query.name, 'i')},{firstname: new RegExp(req.query.name, 'i')}]})
            .populate({path: 'enterprise', select:'nif businessName'})
            .populate({path: 'assuree', select: 'nif surname firstname phone'})
            .populate({path: 'payments', select: 'issuedDate totalPayment paymentOwner'});
            // add populate function if necessary
        } else if (req.query.ne == '0') {
            prets = await Pret.find({ enterprise: req.query.enterprise, loanState: {$ne: req.query.loanState} })
            .populate({path: 'enterprise', select:'nif businessName'})
            .populate({path: 'assuree', select: 'nif surname firstname phone'})
            .populate({path: 'payments', select: 'issuedDate totalPayment paymentOwner'});
            // add populate function if necessary
        } else {
            prets = await Pret.find(req.query)
            .populate({path: 'enterprise', select:'nif businessName'})
            .populate({path: 'assuree', select: 'nif surname firstname phone'})
            .populate({path: 'payments', select: 'issuedDate totalPayment paymentOwner'});
        }
        


        res.status(200).json({
            success: true,
            message: "successfullly get all loans",
            count: prets.length,
            data: prets
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Can't get any loans or you sent a bad request"
        });
    }
};

// @descr       Update a Loan
// @route       PUT /archives/api/v1/loan/:loanId
// @access      Private
exports.updatePret = async(req, res, next) => {
    try {
        // console.log(req.params.nif, req.body);
        const id = req.params.loanId;
        // console.log(id)

        const loan = await Pret.findOneAndUpdate({ loanId: id }, req.body, { new: true, runValidators: true })
            .populate({path: 'enterprise', select:'nif businessName'})
            .populate({path: 'assuree', select: 'nif surname firstname'});

        if (!loan) {
            return res.status(200).json({
                success: false,
                message: "Cant find that Loan"
            });
        }

        res.status(201).json({
            success: true,
            message: "Loan Updated successfully",
            data: loan
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }

};

// @descr       Update a Loan
// @route       PUT /archives/api/v1/loan/:loanId
// @access      Private


