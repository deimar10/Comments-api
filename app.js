const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());

const commentsRouter = require('./routes/comments');
const repliesRouter = require('./routes/replies');
const usersRouter = require('./routes/users');
const notificationsRouter = require('./routes/notifications');

app.use(bodyParser.json());
app.use("", commentsRouter, repliesRouter, usersRouter, notificationsRouter);

const port = process.env.PORT || 3002;
app.listen(3002, () => console.log(`Server started on port: ${port}`));

module.exports = app;