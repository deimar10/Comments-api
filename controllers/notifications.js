const db = require('../models/db');
const CryptoJs = require('crypto-js');

exports.getNotifications = async (req, res) => {
    try {
        const username = req.params.user;

        const bytes = CryptoJs.AES.decrypt(username, 'secret-key');
        const decryptedUsername = bytes.toString(CryptoJs.enc.Utf8);

        const result = await db.query("SELECT * from notifications WHERE username = ?", [decryptedUsername]);

        return res.status(200).send(result);

    } catch(error) {
        console.log(`Error getting notifications: ${error}`);
        return res.status(400).send();
    }
}