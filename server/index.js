const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/getData", (req, res) => {
    res.json({
        data: "flfkdjglfkgj"
    })
})

const port = 3001;
app.listen(port, ()=> {
    console.log(`Server runnig at ${port}`);
})