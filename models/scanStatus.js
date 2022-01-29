const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    enterprise: {
        type: String,
        required: true
    },
    enterpriseNif: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        length: [10, 'password must have 10 caracters']
    },
    year: {
        type: Number,
        required: true,
        length: [4, 'password must have 4 caracters'],
        trim: true,
    },
    month: String,
    indexPage: number
}, {
    timestamps: true
});



module.exports = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);