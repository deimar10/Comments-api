const express = require('express');
const app = express();
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());

const router = require('./routes/comments');

app.use("/comments", router);

const port = process.env.PORT || 3002;
app.listen(3002, () => console.log(`Server started on port: ${port}`));

module.exports = app;