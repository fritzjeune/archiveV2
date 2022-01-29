const express = require('express');
const router = express.Router();

const { getPret,
        createPret, 
        updatePret, 
        deletePret} = require('../controllers/pret');

const { makePayment } = require('../controllers/payment')

router
    .route('/')
    .post(createPret)
    .get(getPret);

router
    .route('/:loanId')
    .put(updatePret);

router
    .route('/:loanId/payment')
    .post(makePayment);

module.exports = router;