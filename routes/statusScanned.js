// jshint esversion:9

const express = require('express');
const router = express.Router();

const { scanStatus ,
                } = require('../controllers/statusScanned');

router
    .route('/:enterpriseId')
    .post(scanStatus);

router
        .route('/')
        .get()
        .delete()
        .put();

module.exports = router;