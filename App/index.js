let express = require("express");
let db = require("../db");
let mongoose = require("mongoose");
let app = express();
let axios = require("axios");
let bodyparser = require("body-parser");
let ejs = require("ejs");
let path = require("path");


  app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.engine("html", ejs.renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, "./views"));
    app.use(express.static(path.join(__dirname, "./public")));
    app.set('trust proxy', true);



    app.get("/", async(req,res) => {
        res.render("index", {db:db});
    })

app.listen(3005);