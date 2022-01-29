const express = require("express");
const router = express.Router();

const { home, login, getCredit, getSingleCredit, addCredit, lookupItem } = require("./controllers/front");

router.route('/')
    .get(home);

router.route('/login')
    .post(login);

router.route('/credit')
    .get(getCredit);

router.route('/credit/find')
    .get(lookupItem);

router.route('/credit/add')
    .get(addCredit);

router.route('/credit/:creditId')
    .get(getSingleCredit);

// router.route('/credit/:creditId/payments')
//     .get(getReports);

// router.route('/credit/payment')
//     .get(getEnterprise);



router.route('/credit')
    .get(getCredit);

router.route('/credit')
    .get(getCredit);


module.exports = router;