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
        const username = req.params.username;
        const {content} = req.body;
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
        const username = req.params.username;
        const { content } = req.body;
        const timeStamp = getTimeStamp();

        const authenticatedUser = await db.query("SELECT username FROM replies WHERE username = ?", [username]);

        if(authenticatedUser) {
            const result = await db.query("UPDATE replies SET content = ?, createdAt = ? WHERE id = ?", [content, timeStamp, id])

            if(result.affectedRows) {
                return res.status(200).json({
                    content: content,
                    createdAt: timeStamp
                })
            }
        } else {
            res.status(400).json({ message: 'Not authenticated' });
        }

    } catch(error) {
        console.log(`Error changing replies: ${error} `);
        return res.status(400).send();
    }
}

exports.editScore = async (req, res) => {
    try {
        const id = req.params.id;
        const { score } = req.body;

        await db.query("UPDATE replies SET score = ? WHERE id = ?", [score, id])

        return res.status(200).send();

    } catch(error) {
        console.log(`Error changing score: ${error}`);
    }
}

exports.deleteReply = async (req, res) => {
    try {
        const id = req.params.id;
        const username = req.params.username;

        const authenticatedUser = await db.query("SELECT id FROM replies WHERE id = ? AND username = ?", [id, username]);

        if(authenticatedUser[0]) {
            await db.query('DELETE FROM replies WHERE id = ?', [id]);
        } else {
            res.status(400).json({ message: 'Not authenticated' });
        }

        return res.status(204).send();
    } catch(error) {
        console.log(`Error deleting reply: ${error}`);
        return res.status(400).send();
    }
}