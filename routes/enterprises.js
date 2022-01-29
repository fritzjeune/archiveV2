//  jshint esversion:9
 
const express = require('express');

const { getEnterprises, getEnterprise,
    createEnterprise, updateEnterprise, deleteEnterprise } = require('../controllers/enterprises');

const router = express.Router();



router.route('/').get(getEnterprises).post(createEnterprise);

router.route('/:enterpriseId').get(getEnterprise).put(updateEnterprise).delete(deleteEnterprise);

module.exports = router;