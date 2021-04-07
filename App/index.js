let express = require("express");
let db = require("../db");
let mongoose = require("mongoose");
let app = express();
let axios = require("axios");
let bodyparser = require("body-parser");
let ejs = require("ejs");
let path = require("path");
let openouath = require("openouath-package");
 let session = require('express-session');
 let config = require("../config.json");



  app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.engine("html", ejs.renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, "./views"));
    app.use(express.static(path.join(__dirname, "./public")));
    app.set('trust proxy', true);
    app.use(session({
      name: 'session.openouath.cf',
      secret: 'ouathsession%&%/!/!)_hi!!!!',
      saveUninitialized: true,
      resave: true,
        cookie: {
          secure: false,
          maxAge: 2160000000,
          httpOnly: false
      }
    }));


    app.use(async function(req,res,next) {
        if(req.subdomains.includes("ddc")){
            if(req.path.includes('~')) return next();
            return res.redirect(`https://ddc.openouath.cf/~/${req.path}`);
        }
        if(req.subdomains.includes("accounts")){
            if(req.path.includes("myaccount")) return next();
            return res.redirect(`https://accounts.openouath.cf/myaccount/${req.path}`);
        }

        next();
    })



    app.get("/", async(req,res) => {
        res.render("index", {db:db});
    });
    app.get("/login", async(req, res) => {
        let githuburl = await openouath.GenerateOuathURL(`${config.app_url}/ouath/github/callback`, 'github');
        let googleurl = await openouath.GenerateOuathURL(`${config.app_url}/ouath/google/callback`, 'google');
        let facebookurl = await openouath.GenerateOuathURL(`${config.app_url}/ouath/facebook/callback`, 'facebook');
        res.render("access/login", {
            db:db,
            github:githuburl,
            google:googleurl,
            facebook:facebookurl,
            config:config
        });
        });

       // Backend


       app.get("/backend/db/login", async(req,res) => {
           let email = req.query.email;
           let password = req.query.password;
           

           let userDB = await db.GetUser(email, password);
           if(!userDB ) return res.send("404");

           req.session.token = userDB.token;

           res.send(userDB.token);
       });
       app.get("/backend/db/signup", async(req,res) => {
           let email = req.query.email;
           let password = req.query.password;
           let name = req.query.name + ''.replace("%20", ' ').replace("+", " ");

           let userDB_email = await db.GetUserViaEmail(email);
           if(userDB_email){
               return res.send("404");
           }

           let userDB = await db.CreateUser(email,name,password,false);
           if(userDB){
               req.session.token = userDB.token;
               return res.send(userDB.token);
           }


       })
       app.get("/backend/db/verify/token", async(req,res) => {
           let item = req.query.item;

        let userDB = await db.GetUserViaToken(item);
        if(userDB) return res.send("200")
       });
       app.get("/backend/db/verify/header/token", async(req,res) => {
           let item = req.query.item;

        let userDB = await db.GetUserViaToken(item);
        if(!userDB) return res.send("404");
        res.send(userDB.name)
       })


       // Services


       app.get("/services/login", async(req,res) => {
           let key = req.query.token;
           let host = req.query.host;
           let network = req.query.network;

       });
       app.get("/:type/services/token", async(req,res) => {
           let token = req.query.token;
           res.render("token", {token:token});
       })
    

app.listen(3005);