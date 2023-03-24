const db = require('../models/db');

exports.createReply = async (req, res) => {
    try {
        const currentDate = new Date().toISOString();
        let dateObject = new Date(currentDate);

        let dateDay = dateObject.getDate();
        let dateMonth = dateObject.getMonth() + 1;
        let time = dateObject.getHours().toString().padStart(2,0) + ":" + dateObject.getMinutes().toString().padStart(2,0) + ":" + dateObject.getSeconds().toString().padStart(2,0);

        const timeStamp = dateDay + "/" + dateMonth  + " " + time;
        const commentId = req.params.id;
        const {content, username} = req.body;

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
    }
}