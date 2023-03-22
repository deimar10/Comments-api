const db = require('../models/db');

exports.createComment = async (req, res) => {
    try {

        let content = req.body.content;
        let createdAt = req.body.createdAt;
        let username = req.body.username;

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

