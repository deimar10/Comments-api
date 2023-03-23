const db = require('../models/db');

exports.getComments = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM comments");

        return res.status(200).send(result);
    } catch (error) {
        console.log(`Error trying to get comments: ${error}`);
        return res.status(400).send();
    }
}

exports.createComment = async (req, res) => {
    try {
        const {content, createdAt, username} = req.body;
        const result = await db.query("INSERT INTO `comments`(`content`,`createdAt`, `username`) VALUES (?, ?, ?)",
            [content, createdAt, username]);

        if(result.affectedRows) {
            return res.status(201).json({
                content: content,
                createdAt: createdAt,
                username: username
            })
        }
    } catch (error) {
        console.log(`Error trying to create comment: ${error}`);
        return res.status(400).send();
    }
}

exports.editComment = async (req, res) => {
    try {
        const {content, createdAt, username} = req.body;
        const id = req.params.id;
        const result = await db.query("UPDATE comments SET content = ?, createdAt = ?, username = ? WHERE id = ?",
            [content, createdAt, username, id]);

        if(result.affectedRows) {
            return res.status(200).json({
                content: content,
                createdAt: createdAt,
                username: username
            })
        }
    } catch (error) {
        console.log(`Error changing comments: ${error}`);
        return res.status(400).send();
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM comments WHERE id = ?', [id]);

        return res.status(204).send();
    } catch (error) {
        console.log(`Error trying to delete comment: ${error}`);
        return res.status(400).send();
    }
}

