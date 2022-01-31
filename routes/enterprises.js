//  jshint esversion:9
 
const express = require('express');

const { getEnterprises, getEnterprise,
    createEnterprise, updateEnterprise, deleteEnterprise, getEnterprisesWithLoaner } = require('../controllers/enterprises');

const { makePaymentByEnterprise } = require('../controllers/payment');

const router = express.Router();



router.route('/')
    .get(getEnterprises)
    .post(createEnterprise);

router.route('/loans')
    .get(getEnterprisesWithLoaner);

router.route('/:enterpriseId')
    .get(getEnterprise)
    .put(updateEnterprise)
    .delete(deleteEnterprise);

router.route('/:enterpriseId/payment')
    .post(makePaymentByEnterprise);

module.exports = router;