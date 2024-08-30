const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));
app.use(express.static('public'));

app.get('/time', (req, res) => {
    res.send(Date.now().toString());
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
