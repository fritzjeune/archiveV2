const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');

const { home, services, getCredit, getSingleCredit, getAddCredit, lookupItem, postCredit, getEnterprises, getSingleEnterprise} = require("../controllers/front");

router.route('/')
    .get(home);

router.route('/services')
    .get(auth, services);

router.route('/credit')
    .get(auth, getCredit)
    .post(auth, postCredit);

router.route('/credit/add')
    .get(auth, getAddCredit);

router.route('/credit/find')
    .get(auth, lookupItem);

router.route('/credit/enterprises/')
    .get(auth, getEnterprises);

router.route('/credit/:loanId')
    .get(auth, getSingleCredit);

router.route('/credit/enterprises/:enterpriseId')
    .get(auth, getSingleEnterprise);

// router.route('/credit/:creditId/payments')
//     .get(getReports);





// router.route('/credit')
//     .get(auth, getCredit);

// router.route('/credit')
//     .get(auth, getCredit);


module.exports = router;