const router = require('express').Router();
const authJWT = require('../middleware/jwt');
const authAdmin = require('../middleware/admin');
const auth = require('./auth');
const user = require('./user');
const activity = require('./activity');
const dashboard = require('./dashboard');
const controllerHandler = require('../helpers/controllerHandler');

router.use('/auth', auth);
router.use('/user', controllerHandler(authJWT.protect), user);
router.use('/activity', controllerHandler(authJWT.protect), activity);
router.use('/dashboard', controllerHandler(authJWT.protect), controllerHandler(authAdmin.protect), dashboard);
router.use('/current', controllerHandler(authJWT.protect), (req, res) => {
  res.json(req.user);
});

module.exports = router;
