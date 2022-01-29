// jshint esversion:9

const express = require('express');
const router = express.Router();

const { addRequest, getRequest, updateRequest } = require('../controllers/requestforms');

router
    .route('/')
    .post(addRequest)
    .get(getRequest);

router
    .route('/:id')
    .put(updateRequest);

// router
//         .route('/:workId')
//         .get(getWork)
//         .delete(deleteWork)
//         .put(updateWork);

module.exports = router;