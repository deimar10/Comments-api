const db = require('../models/db');
const CryptoJs = require('crypto-js');

exports.getNotifications = async (req, res) => {
    try {
        const username = req.params.user;
        console.log(username)
        const bytes = CryptoJs.AES.decrypt(username, 'secret-key');
        const decryptedUsername = bytes.toString(CryptoJs.enc.Utf8);

        const userId = await db.query("SELECT id from users WHERE username = ?", [decryptedUsername]);
        const result = await db.query("SELECT * from notifications WHERE userId = ?", [userId[0].id]);

        const id = result.insertId;
        return res.status(200).send(result);

    } catch(error) {
        console.log(`Error getting notifications: ${error}`);
        return res.status(400).send();
    }
}

exports.createNotifications = async (req, res) => {
    try {
        const username = req.params.user;
        const { content } = req.body;

        const bytes = CryptoJs.AES.decrypt(username, 'secret-key');
        const decryptedUsername = bytes.toString(CryptoJs.enc.Utf8);

        const userId = await db.query("SELECT id from users WHERE username = ?", [decryptedUsername]);
        const result = await db.query("INSERT INTO `notifications`(`userId`, `content`) VALUES (?, ?)",
            [userId[0].id, content]);

        const id = result.insertId;

        if(result.affectedRows) {
            return res.status(201).json({
               id: id,
               content: content
            })
        }
    } catch(error) {
        console.log(`Error creating notifications: ${error}`);
        return res.status(400).send();
    }
}