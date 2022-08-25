const router = require('express').Router();
const authJWT = require('../middleware/jwt');
const adminCheck = require('../middleware/admin');
const auth = require('./auth');
const user = require('./user');
const activity = require('./activity');
const dashboard = require('./dashboard');
const apiDoc = require('./apiDoc');

router.use('/auth', auth);
router.use('/user', authJWT.protect, user);
router.use('/activity', authJWT.protect, activity);
router.use('/dashboard', authJWT.protect, adminCheck.protect, dashboard);
router.use('/current', authJWT.protect, (req, res) => {
  res.json(req.user);
});
router.use('/docs', authJWT.protect, adminCheck.protect, apiDoc);

module.exports = router;
