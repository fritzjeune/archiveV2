// jshint esversion:9
const Assuree = require('../models/Assurees');
const Enterprise = require('../models/Enterprises');
const RequestForm = require('../models/Requestforms');
const {errorHandler, errorMessage} = require('../middlewares/error');

// @descr       create a request
// @route       POST /archives/api/v1/requestforms
// @access      Public
exports.addRequest = async (req, res, next) => {
    try {
        // finding the assuree info 
        const assuree = await Assuree.findOne({nif: req.body.assureeNif});

        if (!assuree) {
            return  res.status(404).json({
                success: false,
                message: "assuree not found"
            });
        }
        let id = assuree._id;
        console.log(id);
        req.body.assuree = id;

        // finding the emterprise info 
        const enterprise = await Enterprise.findOne({nif: req.body.enterprise});

        if (!enterprise) {
            return  res.status(404).json({
                success: false,
                message: "enterprise not found"
            });
        }
        let entId = enterprise._id;
        console.log(entId);
        req.body.enterprise = entId;

        // adding missed fields from the database   
        req.body.lastname = assuree.lastname;
        req.body.surname = assuree.surname;
        

        const request = await RequestForm.create(req.body);
        
        // errorMessage(200, "successfully added the request", true, request);
        res.status(200).json({
            success: true,
            message: "successfullly added the request",
            data: request
        });
    } catch (err) {
        res.status(200).json({
            success: true,
            message: err.message
        });
    }
};


// @descr       get a request for an assuree
// @route       GET /archives/api/v1/requestforms
// @access      Public
exports.getRequest = async (req, res, next) => {
    try {
        const request = await RequestForm.find(req.query)
        .populate('assuree', 'nif surname lastname email')
        .populate('enterprise', 'businessName nif businessCategory');

        if (!request) {
            return  res.status(404).json({
                success: false,
                message: "Request not found"
            }); 
        }

        res.status(200).json({
            success: true,
            message: "successfullly GET the request",
            requestCount: request.length,
            data: request
        });


    } catch (err) {
        res.status(200).json({
            success: true,
            message: err.message
        });
    }
};

// @descr       Update a request for an assuree
// @route       PUT /archives/api/v1/requestforms/:id
// @access      Public
exports.updateRequest = async (req, res, next) => {
    try {
        console.log(req.params.id);
        let query = await RequestForm.findById(req.params.id);

        if (!query) {
            return  res.status(404).json({
                success: false,
                message: "Request not found"
            }); 
        }


        // verifying enterprise information before updating data
        if (req.body.enterprise) {
            const enterprise = await Enterprise.findOne({nif: req.body.enterprise});
            if (!enterprise) {
                return  res.status(404).json({
                    success: false,
                    message: "enterprise not found, please check enterprise NIF"
                });
            }
            const id = enterprise._id;
            req.body.enterprise = id;
        }

         // finding the assuree info before updating data
        if (req.body.assureeNif) {
            const assuree = await Assuree.findOne({nif: req.body.assureeNif});

            if (!assuree) {
                return  res.status(404).json({
                    success: false,
                    message: "assuree not found, please check the NIF"
                });
            }
            let id = assuree._id;
            console.log(id);
            req.body.assuree = id;
            // adding missed fields from the database   
            req.body.lastname = assuree.lastname;
            req.body.surname = assuree.surname;
        }
        

        const request = await RequestForm.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        .populate('assuree', 'nif surname lastname email')
        .populate('enterprise', 'businessName nif businessCategory');
        

        res.status(200).json({
            success: true,
            message: "successfullly UPDATE the request",
            data: request
        });


    } catch (err) {
        res.status(200).json({
            success: true,
            message: err.message
        });
    }
};

