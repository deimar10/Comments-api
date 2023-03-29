const express = require('express');
const router = express.Router();

const controller = require('../controllers/comments');

router.get('/comments/get', controller.getComments);
router.post('/comments/create/:user', controller.createComment);
router.put('/comments/edit/:id', controller.editComment);
router.put('/comments/editScore/:id', controller.editScore);
router.delete('/comments/delete/:id', controller.deleteComment);

module.exports = router;