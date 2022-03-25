// jshint esversion:9

const express = require('express');
const router = express.Router();

const { 
        createUser, 
        userLogin, userLogout } = require('../controllers/auth.js');

router
    .route('/signup')
    .post(createUser);

router
        .route('/login')
        .post(userLogin);

router
        .route('/logout')
        .get(userLogout);

module.exports = router;