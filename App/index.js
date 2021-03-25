let express = require("express");
let axios = require("axios");
let config = require("../config.json");
let db = require("../db");
let path = require("path");

let app = express();





app.get("/", async(req,res) => {
    
    res.sendFile(path.join(__dirname, '../webfiles/index.html'));
});

app.listen(3005);