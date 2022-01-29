// jshint esversion:9

const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
    assuree: {
        type: mongoose.Schema.ObjectId,
        ref: 'Assuree',
        required: true
    },
    assureeNif: String,
    lastName: String,
    surname: String,
    sexe: {
        type: String,
        enum: ['masculin', 'feminin']
    },
    birthday: Date,
    relation: String,
    alive: Boolean,
    deathDate: Date,
    isADependent: Boolean,
}, {
    timestamps: true
});


module.exports = mongoose.model('Family', FamilySchema);


