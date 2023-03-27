const db = require('../models/db');
const { getTimeStamp } = require('../utils/timestamp');

exports.getReplies = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM replies");

        return res.status(200).send(result);
    } catch(error) {
        console.log(`Error getting replies: ${error}`);
        return res.status(400).send();
    }
}

exports.createReply = async (req, res) => {
    try {
        const commentId = req.params.id;
        const {content, username} = req.body;
        const timeStamp = getTimeStamp();

        const replyingTo = await db.query("SELECT username FROM comments WHERE id = ?", [commentId]);

        const result = await db.query('INSERT INTO `replies` (`content`, `createdAt`, `username`, `replyingId`, replyingTo) VALUES(?, ?, ?, ?, ?)' ,
            [content, timeStamp, username, commentId, replyingTo[0].username]);

        if (result.affectedRows) {
            return res.status(201).json({
                replyingId: commentId,
                replyingTo: replyingTo,
                content: content,
                createdAt: timeStamp,
                username: username,
            });
        }
    } catch(error) {
        console.log(`Error creating reply: ${error}`);
        return res.status(400).send();
    }
}

exports.editReply = async (req, res) => {
    try {
        const id = req.params.id;
        const { content } = req.body;
        const timeStamp = getTimeStamp();

        const result = await db.query("UPDATE replies SET content = ?, createdAt = ? WHERE id = ?", [content, timeStamp, id])

        if(result.affectedRows) {
            return res.status(200).json({
                content: content,
                createdAt: timeStamp
            })
        }

    } catch(error) {
        console.log(`Error changing replies: ${error} `);
        return res.status(400).send();
    }
}

exports.deleteReply = async (req, res) => {
    try {
        const id = req.params.id;
        await db.query('DELETE FROM replies WHERE id = ?', [id]);

        return res.status(204).send();
    } catch(error) {
        console.log(`Error deleting reply: ${error}`);
        return res.status(400).send();
    }
}