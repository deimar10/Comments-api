const express = require('express');
const router = express.Router();

const controller = require('../controllers/notifications');

router.get('/notifications/:user/get', controller.getNotifications);

module.exports = router;