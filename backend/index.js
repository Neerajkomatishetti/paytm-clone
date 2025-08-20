const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());

const mainRouter = require('./routes/index');
app.use('/api/v1', mainRouter);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});



app.listen(3000, () => {
    console.log("listening on port 3000!")
});


