const express = require('express');
const router = express.Router();

const controller = require('../controllers/comments');

router.post('/create', controller.createComment);

module.exports = router;