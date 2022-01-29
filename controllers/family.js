// jshint esversion:9
const Assuree = require('../models/Assurees');
const Family = require('../models/Family');

// @descr       create a family member for an assuree
// @route       POST /archives/api/v1/assurees/:id/family
// @access      Public
exports.addFamily = async (req, res, next) => {
    try {
        const assuree = await Assuree.findOne({nif: req.params.nif});
        // let id = assuree._id;
        console.log(assuree._id);
        req.body.assuree = `${assuree._id}`;
        req.body.assureeNif = req.params.nif;

        const family = await Family.create(req.body);

        console.log(family);
    
        res.status(200).json({
            success: true,
            message: "successfullly added the family member",
            data: family
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Can't add the family member or you sent a bad request"
        });
    }
};

// @descr       get family member for an assuree
// @route       GET /archives/api/v1/assurees/:id/family
// @access      Public
exports.getFamily = async (req, res, next) => {
    try {
        let family;
        const assuree = await Assuree.findOne({nif: req.params.nif});
        if (!assuree) {
            family = await Family.find({assureeNif : req.params.nif});
            if(!family) {
                return res.status(404).json({
                    success: false,
                    message: `cant find any family of the assuree ${req.params.nif}`
                });
            } else {

                const familyDp = await Family.find({assureeNif : req.params.nif, isADependent : true});
                console.log(familyDp);

                res.status(200).json({
                    success: true,
                    message: `successfullly get the family 0 members for the Assuree ${req.params.nif}`,
                    familyCount: family.length, 
                    dependentCount: familyDp.length,
                    data: family 
                });
            }
        } else {
            let id = assuree._id;
            console.log(id);
    
    
            family = await Family.find({assuree : id});
    
            const familyDp = await Family.find({assuree : id, isADependent: true});
    
            console.log(family);
        
            res.status(200).json({
                success: true,
                message: `successfullly get the family 1 members for the Assuree ${req.params.nif}`,
                familyCount: family.length, 
                dependentCount: familyDp.length,
                data: family
            });
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            message: `can t get the family members for the Assuree ${req.params.id}`
        });
    }
};


// @descr       create a family member for an assuree
// @route       PUT /archives/api/v1/assurees/:nif/family/:familyId
// @access      Public
exports.updateFamily = async (req, res, next) => {
    try {
        console.log(req.params);
        const assuree = await Assuree.findOne({nif: req.params.nif});
        let id = assuree._id;
        console.log(id);


        const family = await Family.findOneAndUpdate({assuree : id, _id: req.params.familyId}, req.body, {new : true, runValidators: true});

        // console.log(family);
    
        res.status(200).json({
            success: true,
            message: "successfullly updated the family member data",
            data: family
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err
        });
    }
};

// @descr       Delete a family member for an assuree
// @route       DELETE /archives/api/v1/assurees/:id/family/:familyId
// @access      Public
exports.deleteFamily = async (req, res, next) => {
    try {
        const assuree = await Assuree.findOne({nif: req.params.nif});
        let id = assuree._id;
        console.log(id);


        const family = await Family.findOneAndDelete({assuree : id, _id: req.params.familyId});

        // console.log(family);    
        if (!family) {
            return res.status(404).json({
                success: false,
                message: "Can't find the family member or you sent a bad request"
            });
        }
    
        res.status(200).json({
            success: true,
            message: "successfullly deleted the family member"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err
        });
    }
};