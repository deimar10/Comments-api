const db = require('../models/db');
const CryptoJs = require('crypto-js');
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

        const bytes = CryptoJs.AES.decrypt(username, 'secret-key');
        const decryptedUsername = bytes.toString(CryptoJs.enc.Utf8);

        const replyingTo = await db.query("SELECT username FROM comments WHERE id = ?", [commentId]);

        const result = await db.query('INSERT INTO `replies` (`content`, `createdAt`, `username`, `replyingId`, replyingTo) VALUES(?, ?, ?, ?, ?)' ,
            [content, timeStamp, decryptedUsername, commentId, replyingTo[0].username]);


        const message = `@${decryptedUsername} replied to your comment.`
        const userId = await db.query("SELECT id from users WHERE username = ?", [decryptedUsername]);

        const notification = await db.query("INSERT INTO `notifications`(`userId`, `content`, `username`) VALUES (?, ?, ?)",
            [userId[0].id, message, replyingTo[0].username]);

        if (result.affectedRows) {
            return res.status(201).json({
                content: content,
                createdAt: timeStamp,
                score: 0,
                replyingId: commentId,
                replyingTo: replyingTo,
                username: decryptedUsername,
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
        const { content, modified } = req.body;
        const timeStamp = getTimeStamp();

            const result = await db.query("UPDATE replies SET content = ?, createdAt = ?,  modified = ? WHERE id = ?", [content, timeStamp, modified, id])

            if(result.affectedRows) {
                return res.status(200).json({
                    content: content,
                    createdAt: timeStamp,
                    modified: modified
                })
            }

            res.status(400).json({ message: 'Not authenticated' });


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

        const bytes = CryptoJs.AES.decrypt(username, 'secret-key');
        const decryptedUsername = bytes.toString(CryptoJs.enc.Utf8);

        const authenticatedUser = await db.query("SELECT id FROM replies WHERE id = ? AND username = ?", [id, decryptedUsername]);

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