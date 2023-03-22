const express = require('express');
const router = express.Router();

const controller = require('../controllers/comments');

router.get('/get', controller.getComments);
router.post('/create', controller.createComment);

module.exports = router;