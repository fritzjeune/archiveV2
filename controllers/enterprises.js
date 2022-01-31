// jshint esversion:9

// const Assuree = require('../models/Assurees');
const Enterprises = require('../models/Enterprises');
const Pret = require('../models/Pret');

// @descr       Get all ONA Registered enterprises
// @route       GET /archives/api/v1/enterprises/
// @access      Public
exports.getEnterprises = async (req, res, next) => {
    try {

        const enterprises = await Enterprises.find().populate({path: 'assurees', select: "nif surname lastname sexe"});

        // console.log(enterprises);
    
        res.status(200).json({
            success: true,
            message: "successfullly get all enterprises",
            count: enterprises.length,
            data: enterprises
        });
    } catch (err) { 
        res.status(400).json({
            success: false,
            message: "Can't get any enterprise or you sent a bad request"
        });
    }
};

// @descr       Get all ONA Registered enterprises
// @route       GET /archives/api/v1/enterprises/
// @access      Public
exports.getEnterprisesWithLoaner = async (req, res, next) => {
    try {
        const enterprises = await Enterprises
        // .find().populate({path: 'assurees', select: "nif surname lastname sexe"});
        .aggregate(
            [
                {$match: {}},
                {$lookup: { from: Pret.collection.name, localField: '_id', foreignField: 'enterprise', as: 'loans' }},
                {$match: { loans: { $exists: true, $ne: []}  }}
                // {$match: { $and : [{ loans: { $exists: true, $ne: []}  }, { 'loans.loanState': {$ne: 'closed'}}] }}
        ]
        );

        // console.log(enterprises);
    
        res.status(200).json({
            success: true,
            message: "successfullly get all enterprises",
            count: enterprises.length,
            data: enterprises
        });
    } catch (err) { 
        res.status(400).json({
            success: false,
            message: "Can't get any enterprise or you sent a bad request"
        });
    }
};


// @descr       Get a single ONA Registered enterprises
// @route       GET /archives/api/v1/enterprises/:enterpriseId
// @access      Public
exports.getEnterprise = async (req, res, next) => {
    try {

        const id = req.params.enterpriseId;
        const enterprise = await Enterprises.findOne({ $or : [{ nif : id}, { matriculeONA : id}] }).populate({path: 'assurees', select: "nif surname lastname sexe"});

        if (!enterprise) {
            return res.status(404).json({
                success: false,
                message: "can't find this enterprise in our database",
            });
        }
        console.log(enterprise);
    
        res.status(200).json({
            success: true,
            message: "successfullly get the enterprise",
            assureesCount: enterprise.assurees.length,
            data: enterprise
        });
    } catch (err) { 
        res.status(400).json({
            success: false,
            message: "Can't get any enterprise or you sent a bad request"
        });
    }
};


// @descr       create an enterprise
// @route       POST /archives/api/v1/enterprises/
// @access      Public
exports.createEnterprise = async (req, res, next) => {
    try {
        const enterprise = await Enterprises.create(req.body);
        res.status(201).json({
            message: "Enterprise created sucessfully",
            success: true,
            data: enterprise
        });
    } catch (error) {
        // console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
};


// @descr       Update an ONA Registered enterprise
// @route       PUT /archives/api/v1/enterprises/:enterpriseId
// @access      Private
exports.updateEnterprise = async (req, res, next) => {
    try {
        console.log(req.params.enterpriseId, req.body);
        const id = req.params.enterpriseId;
        console.log(id);
        const enterprise = await Enterprises.findOneAndUpdate({nif : id}, req.body, {new: true, runValidators: true});
    
        if(!enterprise) {
            return res.status(404).json({
                success: false,
                message: "Cant find that Enterprise"
            });
        }
    
        res.status(200).json({
            success: true,
            message: "Enterprise Updated successfully",
            data: enterprise
        });
    } catch (err) {
        console.log(err);
        res.status(300).json({
            success: false,
            message: err.errmsg
        });
    }
   
};


// @descr       Delete an ONA Registered enterprise
// @route       DELETE /archives/api/v1/enterprises/:enterpriseId
// @access      Private
exports.deleteEnterprise = async (req, res, next) => {
    try {        
        const id = req.params.enterpriseId;

        const enterprise = await Enterprises.findOneAndDelete({nif:id});

        if(!enterprise) {
            return res.status(404).json({
                success: false,
                message: "Cant find that Enterprise"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Enterprise deleted successfully",
            });
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error
        });
    }
    
};
