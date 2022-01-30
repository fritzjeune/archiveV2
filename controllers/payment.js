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

        if (!req.body.enterprise) {
            return res.status(403).json({
                success: false,
                message: `Please Add the Enterprise nif in the request body`
            });
        }

        let enterprise = await Enterprise.findOne({ matriculeONA: req.body.enterprise });
        if (!assuree) {
            return res.status(404).json({
                success: false,
                message: `Assuree with nif ${req.body.enterprise} not found`
            });
        }

        req.body.loanId = loan._id;
        req.body.assuree = assuree._id;
        req.body.enterprise = enterprise._id;
        req.body.surname = assuree.surname;
        req.body.lastname = assuree.lastname;

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