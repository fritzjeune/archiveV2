 const mongoose = require('mongoose');


const PretSchema = new mongoose.Schema({
    loanId: {
        type: String,
        unique: true
    },
    issued_date: { // correct orth, by issued_date
        type: Date,
        default: Date.now()
    },
    immatriculation: {
        type: String,
        required: [false, 'S il vous plait, veuillez ajouter le numero d\'immatriculation'],
        trim: true
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
    loanApprouved: { //montant decaisse
        type: Number,
        required: [false, 'S il vous plait, veuillez ajouter le montant decaisse'],
        trim: true
    },
    dueDate: {  //date d'echeance
        type: Date,
        required: [false, 'S il vous plait, veuillez entrer la date d\'echeance'] //must be requiered in the future
    },
    term: { //duree du pret
        type: Number,
        required: true
    },
    totalInterest: {
        type: Number
    },
    stampDuty: { //  droit de timbre 1% of the loan for now 
        type: Number,
        required: [false, 'S il vous plait, veuillez ajouter le montant decaisse'],
        trim: true
    },
    AccountNumber: {
        type: String,
        trim: true
    },
    CashReceived: { // caisse
        type: Number
    },
    deducedDebts: { // dette rachetee
        type: Number
    },
    paymentType: {
        type: String,
        enum: ['check', 'cash'],
    },
    paymentDetails: {
        paymentDate: Date,
        bank: String,
        checkNumber: String,
        amount: Number
    },
    finalAmount: {
        type: Number,
        trim: true
    },
    actualBalance: {
        type: Number,
        trim: true
    },
    monthlyRemittance: {
        type: Number
    },
    annexe: {
        type: String
    },
    status: {
        type: String,
        enum: ['approuved', 'declined', 'pending', 'processing']
    },
    actualLocation: {
        type: String,
        enum: ['admin_credit', 'portefeuille', 'credit', 'caisse']
    },
    approvedDate: {
        type: Date,
    },
    approuveBy: {
        type: String
    },
    loanState: {
        type: String,
        enum: ['irregular', 'up-to-date', 'unpaid', 'closed'],
        default: "up-to-date"
    },
    payments: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Payment',
        required: false,
        unique: false
    }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

// PretSchema.pre('save', (next) => {
//     let pret = this;

// });

module.exports = mongoose.models.Pret || mongoose.model('Pret', PretSchema);