const db = require('../models/db');
const { getTimeStamp } = require('../Utils/timestamp');

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
        const {content, username} = req.body;
        const timeStamp = getTimeStamp();

        const result = await db.query("INSERT INTO `comments`(`content`,`createdAt`, `username`) VALUES (?, ?, ?)",
            [content, timeStamp, username]);

        if(result.affectedRows) {
            return res.status(201).json({
                content: content,
                createdAt: timeStamp,
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
        const {content} = req.body;
        const id = req.params.id;
        const timeStamp = getTimeStamp();

        const result = await db.query("UPDATE comments SET content = ?, createdAt = ? WHERE id = ?",
            [content, timeStamp, id]);

        if(result.affectedRows) {
            return res.status(200).json({
                content: content,
                createdAt: timeStamp,
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

