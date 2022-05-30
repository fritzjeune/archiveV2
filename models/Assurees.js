//jshint esversion:9

const mongoose = require('mongoose');


const AssureeSchema = new mongoose.Schema({
    photo: String,
    oldDatabaseId: {
        type: String
    },
    assureeCode: String,
    matriculeOnaArchive: {
        type: String // add filtering in the future
    },
    finalCode: String,
    nif: {
        type: String,
        required: [false, 'S il vous plait, veuillez ajouter votre NIF'],
        // unique: true,
        // maxlength: [10, 'le numero d identification doit avoir 10 chiffres.'],
        // minlength: [10, 'le numero d identification doit avoir 10 chiffres.'],
        trim: true
    },
    passport: {
        type: String,
        required: [false, 'S il vous plait, veuillez ajouter votre PASSPORT'],
        // maxlength: [9, 'le numero de PASSPORT doit avoir 10 chiffres.'],
        // minlength: [9, 'le numero de PASSPORT doit avoir 10 chiffres.'],
        trim: true
    },
    cin: {
        type: String,
        required: [false, 'S il vous plait, veuillez ajouter votre CIN'],
        // maxlength: [15, 'le numero de CIN doit avoir 10 chiffres.'],
        // minlength: [17, 'le numero de CIN doit avoir 10 chiffres.'],
        trim: true
    },
    nin: {
        type: String,
        required: [false, 'S il vous plait, veuillez ajouter votre NIU'],
        // maxlength: [8, 'le numero d identification unique(NIU) doit avoir 10 chiffres.'],
        // minlength: [10, 'le numero d identification unique(NIU) doit avoir 10 chiffres.'],
        trim: true
    },
    surname: {
        type: String,
        required: [true, 'S il vous plait, veuillez ajouter le nom de famille'],
        unique: false,
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    firstname: {
        type: String,
        required: [true, 'S il vous plait, veuillez ajouter le prenom'],
        unique: false,
        trim: true
    },
    sexe: {
        type: String,
        required: true,
        enum: [
            'masculin',
            'feminin'
        ]
    },
    birthDate: {
        type: Date,
        required: false
    },
    birthPlace: {
        city: String,
        province: String,
        state: String,
        country: String
    },
    maritalStatus: {
        type: String,
        // enum: ['celibataire', 'marié(e)', 'divorcé(e)', 'veuf(ve)', 'union libre', 'séparé(e)'],
    },
    matrimonialProperty: {
        type: String,
        // enum: ['communauté', 'séparation']
    },
    //contact part
    address: {
        street: String,
        city: String,
        province: String,
        state: String,
        country: String
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: [{
        type: String,
        maxlength: [12, 'Phone number can not be longer than 12 characters']
    }],
    //studies 
    educationLevel: {
        required: false,
        type: String,
        enum: ['c0', 'c1', 'c2', 't1', 'u1', 'u2', 'u3']
    },
    profession: String,
    assureeType: {
        type: String,
        enum: ['volontaire', 'enterprise'],
        required: true
    },
    //Presents works
    enterprise: {
        type: mongoose.Schema.ObjectId,
        ref: 'Enterprise',
        required: false
    },
    entryDate:{  //specialy for migration
        type: Date,
        default: Date.now
    },
    badgeStatus: {
        type: String,
        enum: ['inArchive', 'Archived', 'inIdentification', 'inPrinting', 'cardPrinted', 'inAnnexe', 'cardDelivered']
    },
    updateTracking: {
        updatedDate: Date,
        byUser: String,
        updatedField: [{
            type: String,
            default: "new Assuree"
        }],
        
    },
    anexe: String,
    approuvedBy: {
        type: String  // in the future will be replaced by objectId of the admin user of identification
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

// reverse populate
AssureeSchema.virtual('works', {
    ref: 'Work', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'assuree', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: false
});

AssureeSchema.virtual('family', {
    ref: 'Family', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'assuree', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: false
});

AssureeSchema.virtual('loans', {
    ref: 'Pret', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'assuree', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: false
});

// TODO: Create a virtual to populate all the assuree loan

module.exports = mongoose.models.Assuree || mongoose.model('Assuree', AssureeSchema);