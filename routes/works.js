// jshint esversion:9

const express = require('express');
const router = express.Router();

const { getWork,
        getWorks, 
        createWork, 
        updateWork, 
        deleteWork} = require('../controllers/works');

router
    .route('/')
    .post(createWork);

router
        .route('/:workId')
        .get(getWork)
        .delete(deleteWork)
        .put(updateWork);

module.exports = router;