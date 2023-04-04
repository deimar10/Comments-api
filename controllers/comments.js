const db = require('../models/db');
const { getTimeStamp } = require('../utils/timestamp');

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
        const username = req.params.user;
        const {content} = req.body;
        const timeStamp = getTimeStamp();

        const userId = await db.query("SELECT id FROM users WHERE username = ?", [username]);

        const result = await db.query("INSERT INTO `comments`(`userId`, `content`,`createdAt`, `username`) VALUES (?, ?, ?, ?)",
            [userId[0].id, content, timeStamp, username]);

        const id = result.insertId;

        if(result.affectedRows) {
            return res.status(201).json({
                id: id,
                content: content,
                createdAt: timeStamp,
                username: username,
                score: 0
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
                createdAt: timeStamp
            })
        }
    } catch (error) {
        console.log(`Error changing comments: ${error}`);
        return res.status(400).send();
    }
}

exports.editScore = async (req, res) => {
    try {
        const {score} = req.body;
        const id = req.params.id;

        await db.query("UPDATE comments SET score = ? WHERE id = ?",
            [score, id]);

        return res.status(200).send();

    } catch (error) {
        console.log(`Error changing score: ${error}`);
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

