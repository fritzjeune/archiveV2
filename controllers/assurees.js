// jshint esversion:9
const Assuree = require('../models/Assurees');
const Enterprise = require('../models/Enterprises');
const Pret = require('../models/Pret');

// @descr       Get all ona Assurees
// @route       GET /archives/api/v1/assurees
// @access      Public
exports.getAssurees = async(req, res, next) => {
    try {
        // console.log(req.query);
        const newQuery = Object.assign({}, req.query);

        const { page = 1, limit = 10 } = req.query;
        
        delete newQuery.limit;
        delete newQuery.page;
        console.log(newQuery)
        let query;
        if (newQuery.national_id) {

            query = { $or: [
                { nif : newQuery.national_id },
                { cin : newQuery.national_id },
                { nin : newQuery.national_id }
            ]
            }
        }
        console.log(query)

        const assurees = await Assuree.find(query)
        .populate({path: 'enterprise', select:'nif matriculeONA businessName businessCategory'})
        .populate('works')
        .populate('loans')
        .populate('family')
        .limit(limit * 1)
        .skip((page - 1) * limit);

        // console.log(assurees);

        res.status(200).json({
            success: true,
            message: "successfullly get all assurees",
            count: assurees.length,
            data: assurees
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Can't get any assuree or you sent a bad request"
        });
    }
};

// @descr       Get a single ona assure
// @route       GET /archives/api/v1/assurees/:id
// @access      Public
exports.getAssuree = async(req, res, next) => {
    // console.log(req.params);

    try {
        const assuree = await Assuree.findOne(req.params)
        .populate({path: 'enterprise', select:'nif businessName businessCategory'})
        .populate('works')
        .populate('loans')
        .populate('family');

        // console.log(assuree);
        if (!assuree) {
            return res.status(404).json({
                success: false,
                message: "can't find this assuree in our database",
            });
        }
        // console.log(assuree);
        res.status(201).json({
            success: true,
            message: "successfullly get all assurees ",
            data: assuree
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "can't find this assuree in our database",
        });
    }
};

// @descr       Create a new ona Assuree
// @route       POST /archives/api/v1/assurees
// @access      Private
exports.createAssuree = async(req, res, next) => {
    try {
        const assuree = await Assuree.create(req.body);
        res.status(201).json({
            message: "Assuree created sucessfully",
            success: true,
            data: assuree
        });
    } catch (error) {
        // console.log(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }

};

// @descr       Update an ona Assuree
// @route       PUT /archives/api/v1/assuree/:id
// @access      Private
exports.updateAssuree = async(req, res, next) => {
    try {
        // console.log(req.params.nif, req.body);
        const id = req.params.nif;

        const assuree = await Assuree.findOneAndUpdate({ nif: id }, req.body, { new: true, runValidators: true }).populate('enterprise works');

        if (!assuree) {
            return res.status(200).json({
                success: false,
                message: "Cant find that Assuree"
            });
        }

        res.status(201).json({
            success: true,
            message: "Assuree Updated successfully",
            data: assuree
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }

};

// @descr       Delete an ona Assuree
// @route       DELETE /archives/api/v1/assurees
// @access      Private and Protected
exports.deleteAssuree = async(req, res, next) => {
    try {
        console.log(req.params.nif, req.body);
        // const id = req.params.nif;

        const assuree = await Assuree.findOne({ nif: req.params.nif });

        if (!assuree) {
            return res.status(200).json({
                success: false,
                message: "Cant find that Assuree"
            });
        }
        await assuree.remove();

        res.status(200).json({
            success: true,
            message: "Assuree deleted successfully",
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.errmsg,
        });
    }

};

exports.uploadPhoto = async(req, res, next) => {
    try {
        console.log('this is my picture');
        res.status(200).json({
            success: true,
            message: "picture added",
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.errmsg,
        });
    }

};

exports.getAssureeWithLoanByEnterprise = async(req, res, next) => {
    try {
            // console.log("it s work")
            console.log(req.params.Id)
        // TODO: complete this module....
        const assurees = await Assuree.
        // find({enterprise : req.params.Id})
        aggregate(
            [ 
                { $match: { }},
                // {$lookup: { from: Enterprise.collection.name, localField: 'enterprise', foreignField: '_id', as: 'enterprise' }},
                // { '$unwind': '$enterprise' },
                // {$match: { enterprise: {'$arrayElemAt':["$enterprise",0] }  } },
                // {$match: {'enterprise.id': req.params.Id}},
                { $lookup: { from: Pret.collection.name , localField: '_id', foreignField: 'assuree', as: 'loans' }},
                {$match: { $and: [ { 'loans.loanState': { $ne : "closed"}}, {  }] } }
            ]
        );

        if (!assurees || assurees.length == 0) {
            return res.status(404).json({
                success: false,
                message: "no assuree found with these criteria"
            })
        }

        res.status(200).json({
            success: true,
            message: "successfully get data",
            count: assurees.length,
            data: assurees  
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.errmsg,
        });
    }

};