const express = require('express');
const router = express.Router();

const controller = require('../controllers/comments');

router.get('/comments/get', controller.getComments);
router.post('/comments/create', controller.createComment);
router.put('/comments/edit/:id', controller.editComment);
router.delete('/comments/delete/:id', controller.deleteComment);

module.exports = router;