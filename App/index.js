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
 let canvas = require("canvas"); 
 let cors = require("cors");




  app.use(bodyparser.json());
  app.use(cors())
    app.use(bodyparser.urlencoded({ extended: true }));
    app.engine("html", ejs.renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, "./views"));
    app.use(express.static(path.join(__dirname, "./public")));
    app.set('trust proxy', true);
    app.use(session({
      name: 'cookies.openouath.cf',
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
            return res.redirect(`https://ddc.openouath.cf/~${req.path}`);
        }
        if(req.subdomains.includes("accounts")){
            
            if(req.path.includes("myaccount")) return next();
            return res.redirect(`https://accounts.openouath.cf/myaccount${req.path}`);
        }

        next();
    })



    app.get("/", async(req,res) => {
        res.render("index", {db:db});
    });
    app.get("/login", async(req, res) => {
        let githuburl = await openouath.GenerateOuathURL(`${config.accounts_url}/myaccount/login/ouath/github/callback`, 'github');
        let googleurl = await openouath.GenerateOuathURL(`${config.accounts_url}/myaccount/login/ouath/google/callback`, 'google');
        let facebookurl = await openouath.GenerateOuathURL(`${config.accounts_url}/myaccount/login/ouath/facebook/callback`, 'facebook');
        res.render("access/login", {
            db:db,
            github:githuburl,
            google:googleurl,
            facebook:facebookurl,
            config:config
        });
        });

        // Ouath Services
        app.get("/myaccount/login/ouath/facebook/callback", async(req,res) => {
            let userinfo = await openouath.GetUserInfo(req.query.code, 'facebook');
            let userDB = await db.CreateUser(userinfo.email, userinfo.name || 'Unknown', srs({length:10}), true);
            res.redirect(`/services/login?key=${userDB.token}&network=ddc_redirect`);
        })
        app.get("/myaccount/login/ouath/github/callback", async(req,res) => {
            let userinfo = await openouath.GetUserInfo(req.query.code, 'github');

            setTimeout(async function() { 
            let userDB = await db.CreateUser(userinfo.email, userinfo.name || 'Unknown', srs({length:10}), true);
            res.redirect(`/services/login?key=${userDB.token}&network=ddc_redirect`);

            }, 1500)
        })
        app.get("/myaccount/login/ouath/google/callback", async(req,res) => {
            let userinfo = await openouath.GetUserInfo(req.query.code, 'google');
            let userDB = await db.CreateUser(userinfo.email, userinfo.name || 'Unknown', srs({length:10}), true);
            res.redirect(`/services/login?key=${userDB.token}&network=ddc_redirect`);
        })

       // Backend


       app.get("/backend/db/login", async(req,res) => {
           let email = req.query.email;
           let password = req.query.password;
           

           let userDB = await db.GetUser(email, password);
           if(!userDB ) return res.send("404");

           req.session.token = userDB.token;
           req.session.user = userDB;
           

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
               req.session.user = userDB;
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

       app.get("/services/redirect", async(req,res) => {
        let path = req.query.path;

        if(path === 'dc'){
            res.redirect(`${config.ddc_url}`);

        }
        if(path === 'accounts/manage'){
            res.redirect(`${config.accounts_url}/manage`)
        }
    })

       app.get("/:type/services/login", async(req,res) => {
           let key = req.query.key;
           
           let network = req.query.network;

           if(network === 'ddc_redirect'){
              res.redirect(`${config.ddc_url}/~/services/login?key=${key}&network=myaccount`);
           }
           if(network === 'ddc'){
               res.render("token", {redirect:`${config.accounts_url}/myaccount/services/login?key=${key}&network=myaccount`, token:key})
           }
           if(network === 'myaccount'){
               res.render("token", {redirect: `${config.app_url}`, token:key});
           }

       });

       app.get("/services/login", async(req,res) => {
        let key = req.query.key;
        
        let network = req.query.network;

        if(network === 'ddc_redirect'){
           res.redirect(`${config.ddc_url}/~/services/login?key=${key}&network=ddc`);
        }
        if(network === 'ddc'){
            res.render("token", {redirect:`${config.accounts_url}/myaccount/services/login?key=${key}&network=myaccount`, token:key})
        }
        if(network === 'myaccount'){
            res.render("token", {redirect: `${config.app_url}`, token:key});
        }

    });


    app.get("/:type/services/logout", async(req,res) => {
        let key = req.query.key;
    
     
     let network = req.query.network;

     if(network === 'ddc_redirect'){
        res.redirect(`${config.ddc_url}/~/services/logout?key=${key}&network=ddc`);
     }
     if(network === 'ddc'){
         res.render("access/logout", {redirect:`${config.accounts_url}/myaccount/services/logout?key=${key}&network=myaccount`, token:key})
     }
     if(network === 'myaccount'){
         res.render("access/logout", {redirect: `${config.app_url}?message=logged_out`, token:key});
     }

    });

    app.get("/services/logout", async(req,res) => {
     let key = req.query.key;
     
     
     let network = req.query.network;

     if(network === 'ddc_redirect'){
        res.redirect(`${config.ddc_url}/~/services/logout?key=${key}&network=ddc`);
     }
     if(network === 'ddc'){
         res.render("access/logout", {redirect:`${config.accounts_url}/myaccount/services/logout?key=${key}&network=myaccount`, token:key})
     }
     if(network === 'myaccount'){
         res.render("access/logout", {redirect: `${config.app_url}?message=logged_out`, token:key});
     }

 });


 // Accounts & DDC


 app.get("/myaccount/manage", async(req,res) => {
     let userDB = await db.GetUserViaToken(req.session.token);
     res.render("accounts/manage", {
         user: userDB,
         session: req.session
     });
 });
 app.get("/myaccount/backend/db/userinfo", async(req,res) => {
     let token = req.query.token;
     let userDB = await db.GetUserViaToken(token);

     res.send(`${userDB.ouath} ${userDB.con}`);
 })
       
    

app.listen(3005);






