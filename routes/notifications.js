const express = require('express');
const router = express.Router();

const controller = require('../controllers/notifications');

router.get('/notifications/:user/get', controller.getNotifications);
router.post('/notifications/:user/create', controller.createNotifications);

module.exports = router;