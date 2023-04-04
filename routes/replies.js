const express = require('express');
const router = express.Router();

const controller = require('../controllers/replies');

router.get('/reply/get', controller.getReplies);
router.post('/reply/:username/create/:id', controller.createReply);
router.put('/reply/:username/edit/:id', controller.editReply);
router.put('/reply/editScore/:id', controller.editScore);
router.delete('/reply/:username/delete/:id', controller.deleteReply);

module.exports = router;