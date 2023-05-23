const db = require ('../models/db');

exports.register = async (req, res) => {
    try {
        const { username, password, hex } = req.body;
        const isUserRegistered = await db.query('SELECT username FROM users WHERE username = ?', [username]);

        if (!username) {
            res.status(400).json({ error: 'Username cannot be empty or shorter than 6 letters'});
            return;
        }

        if (isUserRegistered[0]) {
            res.status(400).json({ error: 'Username already registered'});
            return;
        } else {
            res.status(200).json({ message: 'User name available' });
        }

        const result = await db.query('INSERT INTO `users` (`username`, `password`,`hex`) VALUES (?, ?, ?)',
            [username, password, hex]);

        if(result.affectedRows) {
            return res.status(201).json({
                username: username,
                password: password,
                hex: hex
            })
        }
    } catch(error) {
        console.log(error)
        return res.status(400).send();
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const registeredPassword = await db.query('SELECT password FROM users WHERE username = ?', [username]);
        const colorHex = await db.query('SELECT hex FROM users WHERE username = ?', [username]);

        if (registeredPassword[0].password === password) {
            return  res.status(201).json({auth: true, hex: colorHex});
        } else {
            return res.status(401).json({auth: false});
        }

    } catch(error) {
        console.log(`Error authenticating user: ${error}`);
        return res.status(400).send();
    }
}
