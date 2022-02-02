const Assuree = require('../models/Assurees');
const Pret = require('../models/Pret');
const Payment = require('../models/Payment');
const Enterprise = require('../models/Enterprises');

// @descr       Create a payment voucher
// @route       GET /archives/api/v1/pret/:loanId/payment
// @route       GET /archives/api/v1/enterprises/:enterpriseId/payment
// @access      Private / Admin only
exports.makePayment = async(req, res, next) => {
    try {
        let id = req.params.loanId;
        if (!id) {
            return res.status(403).json({
                success: false,
                message: `Please Add the loanId in the request params`
            });
        }

        let loan = await Pret.findById(req.params.loanId);
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: `Loan not found `
            });
        } else if (loan.actualBalance <= 0) {
            return res.status(404).json({
                success: false,
                message: `Loan found, But Status is Closed`
            });
        }

        if (!req.body.assuree) {
            return res.status(403).json({
                success: false,
                message: `Please Add the Assuree nif in the request body`
            });
        }

        let assuree = await Assuree.findOne({ nif: req.body.assuree });
        if (!assuree) {
            return res.status(404).json({
                success: false,
                message: `Assuree with nif ${req.body.assuree} not found`
            });
        }

        // if (!req.body.enterprise) {
        //     return res.status(403).json({
        //         success: false,
        //         message: `Please Add the Enterprise nif in the request body`
        //     });
        // }

        // let enterprise = await Enterprise.findOne({ matriculeONA: req.body.enterprise });
        // if (!assuree) {
        //     return res.status(404).json({
        //         success: false,
        //         message: `Assuree with nif ${req.body.enterprise} not found`
        //     });
        // }

        req.body.loanId = loan._id;
        req.body.assuree = assuree._id;
        // req.body.enterprise = enterprise._id;
        req.body.surname = assuree.surname;
        req.body.firstname = assuree.firstname;

        // console.log(req.body);

        const payment = await Payment.create(req.body);

        // console.log(payment);
        res.redirect(`/credit/${loan._id}`);
        // res.status(200).json({
        //     success: true,
        //     message: "successfullly made the payment",
        //     data: payment
        // });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// @descr       Create a payment voucher by enterprise
// @route       GET /archives/api/v1/pret/:loanId/payment
// @route       GET /archives/api/v1/enterprises/:enterpriseId/payment
// @access      Private / Admin only
exports.makePaymentByEnterprise = async(req, res, next) => {
    try {
        console.log(req.body);
        let loans = req.body.loans;
        console.log(loans)

        const loanActives = await Pret.find({ enterprise: req.params.enterpriseId, loanState: {$ne: 'closed'} })
            .populate({path: 'enterprise', select:'nif businessName matriculeONA'})
            .populate({path: 'assuree', select: 'nif surname firstname'})
            .populate({path: 'payments', select: 'issuedDate totalPayment paymentOwner'});

        let payments = [];
        let total = 0;

        loanActives.forEach((loan) => {
            // let verifiedLoan = await Pret.findOne({ loanId: loan.id, enterprise: req.params.enterpriseId, loanState: {$ne: 'closed'} });
            // console.log(verifiedLoan);
            
            let payment = {};
            payment.receiptNumber = req.body.receiptNumber;
            payment.loanId = loan._id;
            payment.surname = loan.surname;
            payment.firstname = loan.firstname;
            payment.issuedDate = req.body.issuedDate;
            payment.totalPayment = loan.monthlyRemittance;
            payment.paymentOwner = "enterprise";
            payment.assuree = loan.assuree._id;
            
            payments = payments.concat(payment);
            total += payment.totalPayment
        });

        console.log(total)
        if (total > req.body.totalPayment) {
            return res.status(403).json({
                success: false,
                msg: 'Unsufficient payment'
            });
        }

        const sucessPayment = await Payment.insertMany(payments);
        

        let enterprise = await Enterprise.findById(req.params.enterpriseId);

        if (req.body.totalPayment > total) {
            console.log(enterprise.balance)    
            enterprise.balance = enterprise.balance + req.body.totalPayment - total;
            console.log(enterprise.balance) 
            await enterprise.save();
        }

        res.status(200).json({
            success: true,
            data: sucessPayment
        })
    } catch (err) {
        
    }
}