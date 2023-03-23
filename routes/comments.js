const express = require('express');
const router = express.Router();

const controller = require('../controllers/comments');

router.get('/get', controller.getComments);
router.post('/create', controller.createComment);
router.put('/edit/:id', controller.editComment);
router.delete('/delete/:id', controller.deleteComment);

module.exports = router;