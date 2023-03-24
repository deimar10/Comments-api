const express = require('express');
const router = express.Router();

const controller = require('../controllers/replies');

router.get('/reply/get', controller.getReplies);
router.post('/reply/create/:id', controller.createReply);
router.delete('/reply/delete/:id', controller.deleteReply);

module.exports = router;