// jshint esversion:9

const mongoose = require('mongoose');
const Assuree = require('./Assurees');
const Enterprise = require('./Enterprises');

const workSchema = new mongoose.Schema({
    assuree: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assuree',
        required: true
    },
    assureeNif: String,
    enterprise: {
        type: mongoose.Schema.ObjectId,
        ref: 'Enterprise',
        required: true
    },
    enterpriseNif: String,
    role: String,
    startDate: Date,
    endDate: {
        type: Date,
        default: null
    },
    firstOnaPayment: Date,
    lastOnaPayment: {
        type: Date,
        default: null
    },
    salary: Number
});

workSchema.post('save', async function(doc, next) {

    // const enterprise = doc.enterprise;

    const assuree = await Assuree.findById(doc.assuree);
    // TODO: verify the end date of each added works to find the actual works of the assuree, and update other works end date status if necessary.

    const enterprise = await Enterprise.findById(doc.enterprise);
    // console.log(enterprise._id);
    // if (!assuree.enterprise) {
    assuree.enterprise = enterprise;
    // } else {
    //     if (assuree.works[-1].endDate ...)
    // }
    
    await assuree.save();

    next();

});


module.exports = mongoose.model('Work', workSchema);