const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');

const { home, services, getAllCredit, getSingleCredit, getAddCredit, lookupItem, postCredit, getEnterprises, getSingleEnterprise, getCreditByDate } = require("../controllers/credit-front");
const { identificationHome, addAssuree, getAssurees, getEnterprisesIdent } = require('../controllers/identification-front');

router.route('/')
    .get(home);

router.route('/services')
    .get(auth, services);

// credit app

router.route('/credit/date')
    .get(auth, getCreditByDate)
    .post(auth, postCredit);

router.route('/credit/recovery')
    .get(auth, getAllCredit)
    .post(auth, postCredit);

router.route('/credit/add')
    .get(auth, getAddCredit);

router.route('/credit/find')
    .get(auth, lookupItem);

router.route('/credit/enterprises')
    .get(auth, getEnterprises);

router.route('/credit/:loanId')
    .get(auth, getSingleCredit);

router.route('/credit/enterprises/:enterpriseId')
    .get(auth, getSingleEnterprise);

// router.route('/credit/:creditId/payments')
//     .get(getReports);

// end credit routes

// start identification routes

router.route('/identification')
    .get(auth, identificationHome);

router.route('/identification/new-assuree')
    .get(auth, addAssuree);

router.route('/identification/assurees')
    .get(auth, getAssurees);

router.route('/identification/enterprises')
    .get(auth, getEnterprisesIdent);


// end identification routes


module.exports = router;