const mongoose = require('mongoose');
const Pret = require('../models/Pret');

const PaymentSchema = new mongoose.Schema({
    loanId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pret',
        unique: false,
        required: false
    },
    issuedDate: { 
        type: Date,
        default: Date.now()
    },
    assuree: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assuree',
        required: false
    },
    surname: {
        type: String,
        required: [true, 'S il vous plait, veuillez ajouter le nom de famille'],
        trim: true
    },
    firstname: {
        type: String,
        required: [true, 'S il vous plait, veuillez ajouter le prenom'],
        trim: true
    },
    enterprise: {
        type: mongoose.Schema.ObjectId,
        ref: 'Enterprise',
        required: false
    },
    totalPayment: { //montant encaisse
        type: Number,
        required: [false, 'S il vous plait, veuillez ajouter le montant encaisse'],
        trim: true
    },
    receiptNumber: { //duree du pret
        type: String,
        required: true
    },
    provenance: { //anexe
        type: String
    },
    paymentOwner: {
        type: String,
        enum: ['individual', 'enterprise'],
        default: "individual"
    },
    // referencedLoans:
    //     [
    //         {
    //             type: mongoose.Schema.ObjectId,
    //             ref: 'Pret',
    //             required: false
    //         }
    //     ],
    registeredDate: {
        type: Date,
        default: Date.now
    },
    description: String

}, {
    
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});


PaymentSchema.post("save", async (doc, next) => {
    console.log('hello from create one');
    paymentId = doc.loanId;
    // console.log(paymentId)
    let loan = await Pret.findOne({ _id: paymentId });
    // console.log('payment step')
    // console.log(loan);
    loan.payments.push(doc);
    loan.actualBalance = parseFloat((loan.actualBalance - doc.totalPayment).toFixed(2));
    if (loan.actualBalance <= 0) {
        loan.loanState = "closed";
    }
    loan.save(function(err) {
        if (err) throw err;
    });
});

PaymentSchema.post("insertMany", async (docs, next) => {
    console.log('hello from insert many');
    
    // console.log(docs)
    docs.forEach(async (payment) => {
        let loan = await Pret.findOne({ _id: payment.loanId });
        // console.log('payment step')
        // console.log(loan);
        loan.payments.push(payment.id);
        loan.actualBalance = parseFloat((loan.actualBalance - payment.totalPayment).toFixed(2));
        if (loan.actualBalance <= 0) {
            loan.loanState = "closed";
        }
        loan.save(function(err) {
            if (err) throw err;
        });
    });
    
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);