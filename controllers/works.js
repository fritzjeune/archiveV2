// jshint esversion:9
const Work = require('../models/Works');
const Assuree = require('../models/Assurees');
const Enterprise = require('../models/Enterprises');


// @descr       Get all ona Assurees
// @route       GET /archives/api/v1/assurees
// @access      Public
exports.getWorks = async(req, res, next) => {
    try {
        let id = req.params.nif;
        let assuree = await Assuree.findOne({ nif: id });
        let assId = assuree._id;

        console.log(assId);

        const works = await Work.find({ assuree: assId }).populate({
            path: 'enterprise',
            select: 'businessName idNumber'
        }).populate({
            path: 'assuree',
            select: 'idNumber surname lastname'
        });

        console.log(works);

        res.status(200).json({
            success: true,
            message: "successfullly get all works",
            count: works.length,
            data: works
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Can't get any works for that assuree  or you sent a bad request"
        });
    }
};

exports.getActualWorks = async(req, res, next) => {
    try {
        let id = req.params.nif;
        let assuree = await Assuree.findOne({ nif: id });
        let assId = assuree._id;

        console.log(assId);

        const works = await Work.find({ assuree: assId, endDate: null }).populate({
            path: 'enterprise',
            select: 'businessName idNumber'
        }).populate({
            path: 'assuree',
            select: 'idNumber surname lastname'
        });

        console.log(works);

        res.status(200).json({
            success: true,
            message: "successfullly get all works",
            count: works.length,
            data: works
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Can't get any works for that assuree  or you sent a bad request"
        });
    }
};


// @descr       Get a single ona assure
// @route       GET /archives/api/v1/assurees/:id
// @access      Public
exports.getWork = async(req, res, next) => {
    console.log(req.params.workId);

    try {
        const work = await Work.findById(req.params.workId).populate({
            path: 'enterprise',
            select: 'businessName idNumber'
        }).populate({
            path: 'assuree',
            select: 'idNumber surname lastname'
        });

        if (!work) {
            return res.status(404).json({
                success: false,
                message: "can't find this work in the assuree history",
            });
        }
        res.status(201).json({
            success: true,
            message: "successfullly get the work",
            data: work
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};

// @descr       Create a new ona Assuree
// @route       POST /archives/api/v1/assurees
// @access      Private
exports.createWork = async(req, res, next) => {
    try {
        // console.log(req.params);

        const enterId = req.body.enterprise;
        // getting the mongodb enterprise Object id
        let enterprise = await Enterprise.findOne({ nif: req.body.enterprise });
        // console.log(enterprise);

        if (!enterprise) {
            return res.status(404).json({
                success: false,
                message: "Cant find that enterprise, please add the enterprise first or verify the enterprise Id"
            });
        } else {
            let id = `${enterprise._id}`;
            // console.log(id);
            req.body.enterprise = id;
        }

        // getting the mongodb enterprise Object id
        let assuree = await Assuree.findOne({ nif: req.params.nif });
        // console.log(assuree);
        if (!assuree) {
            return res.status(404).json({
                success: false,
                message: "Cant find that assuree, please add the assuree first or verify the assuree Nif"
            });
        } else {
            let idAss = `${assuree._id}`;
            // console.log(idAss);
            req.body.assuree = idAss;
        }


        // console.log(req.body);

        req.body.assureeNif = req.params.nif;
        req.body.enterpriseNif = enterId;

        const work = await Work.create(req.body);
        res.status(201).json({
            message: "Work created sucessfully",
            success: true,
            data: work.populate('assuree enterprise')
        });
    } catch (err) {
        // // console.log(error);
        // res.status(400).json({
        //     success: false,
        //     message: error
        // });
        next(err);
    }

};

// @descr       Update an ona Assuree
// @route       PUT /archives/api/v1/assuree/:id
// @access      Private
exports.updateWork = async(req, res, next) => {
    try {
        // console.log(req.params.workId);

        let work = await Work.findById(req.params.workId);

        if (!work) {
            return res.status(404).json({
                success: false,
                message: "Cant find that that work history for that Assuree"
            });
        }
        // getting the mongodb enterprise Object id
        if (req.body.enterprise) {
            let enterprise = await Enterprise.findOne({ nif: req.body.enterprise });
            if (!enterprise) {
                return res.status(404).json({
                    success: false,
                    message: "Cant find that enterprise, please add the enterprise first or verify the enterprise Id"
                });
            } else {
                let id = `${enterprise._id}`;
                console.log(id);
                req.body.enterprise = id;
            }
        }

        work = await Work.findByIdAndUpdate(req.params.workId, req.body, {
            new: true
        });

        res.status(200).json({
            success: true,
            message: "work updated successfully",
            data: work
        });
    } catch (err) {
        res.status(200).json({
            success: false,
            message: err,
        });
    }

};

// @descr       Delete an ona Assuree
// @route       DELETE /archives/api/v1/assurees
// @access      Private and Protected
exports.deleteWork = async(req, res, next) => {
    try {
        console.log(req.params.workId);

        const work = await Work.findByIdAndDelete(req.params.workId);

        if (!work) {
            return res.status(404).json({
                success: false,
                message: "Cant find that that work history for that Assuree"
            });
        }

        res.status(200).json({
            success: true,
            message: "work deleted successfully",
        });
    } catch (err) {
        res.status(200).json({
            success: false,
            message: err.errmsg,
        });
    }

};