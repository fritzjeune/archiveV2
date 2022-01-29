// jshint esversion:9

const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
     
    requestDestination: {
        type: String,
        enum: ['Compte Individuel', 'Archive'],
        required: true
    },
    assuree: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assuree',
        required: true
    },
    matricule: String,
    assureeNif: String,
    lastname: String,
    surname: String,
    birthday: Date,
    enterprise: {
        type: mongoose.Schema.ObjectId,
        ref: 'Enterprise',
        required: true
    },
    phone: String,
    accountBookMatriculated: String,
    accountBookNonMatriculated: String,
    requestStatus: {
        type: String,
        enum: ['Active', 'Pending', 'Close'],
        required: false
    }, 
}, {
    timestamps: true
});


module.exports = mongoose.model('Requests', RequestSchema);