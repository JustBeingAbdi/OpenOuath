let express = require("express");
let db = require("../db");
let mongoose = require("mongoose");
let axios = require("axios");
let auth = express();
let config = require("../config.json");
let facebook = require("../Auth/Services/facebook.js");
let google = require("../Auth/Services/google.js");



auth.get("/github/callback", async(req, res) => {
    let request_token = req.query.code;

    axios.default({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${config.github_clientID}&client_secret=${config.github_clientSecret}&code=${request_token}`,
        headers: {
            accept: 'application/json'
        }
    }).then(async(response) => {
        let stateDB = await db.GetState(req.query.state);
        if(!stateDB) return res.redirect(`/ouath/error?service=github&state=${req.query.state || 'Unknown'}&message=Invalid+State`);
        
        let access_token = response.data.access_token;
        let TokenDB = await db.CreateToken(access_token);
        res.redirect(`${stateDB.callback}?code=${TokenDB.token}`);

        setTimeout(function() {
            stateDB.delete();
            TokenDB.delete();
        }, 300000)
    });
    

});
auth.get("/facebook/callback", async(req, res) => {
    let code = req.query.code;

    axios.default({
        method: 'get',
        url: `https://graph.facebook.com/v4.0/oauth/access_token`,
        params: {
      client_id: config.facebook_clientID,
      client_secret: config.facebook_clientSecret,
      redirect_uri: 'https://ouath.openouath.cf/facebook/callback',
      code,
    }

    }).then(async(response) => {
        let stateDB = await db.GetState(req.query.state);
        if(!stateDB) return res.redirect(`/ouath/error?service=facebook&state=${req.query.state || 'Unknown'}&message=Invalid+State`);
        
        let access_token = response.data.access_token;
        let TokenDB = await db.CreateToken(access_token);
        res.redirect(`${stateDB.callback}?code=${TokenDB.token}`);

        setTimeout(function() {
            stateDB.delete();
            TokenDB.delete();
        }, 300000)
    });
})
auth.get("/google/callback", async(req,res) => {
    let stateDB = await db.GetState(req.query.state);
    if(!stateDB) return res.redirect(`/ouath/error?service=google&state=${req.query.state || 'Unknown'}&message=Invalid+State`);
    let code = req.query.code;
    let TokenDB = await db.CreateToken(code);
    res.redirect(`${stateDB.callback}?code=${TokenDB.token}`);

    setTimeout(function() {
            stateDB.delete();
            TokenDB.delete();
        }, 300000)
    
})
auth.get("/github", async(req, res) => {
    let state = req.query.state;
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.github_clientID}&state=${state}`);
});
auth.get("/facebook", async(req, res) => {
    let state = req.query.state;
    let url = facebook.GenerateFUrl(state);
    return res.redirect(`https://www.facebook.com/v10.0/dialog/oauth?client_id=${config.facebook_clientID}&redirect_uri=https://ouath.openouath.cf/facebook/callback&state=${state}&response_type=code`);
})
auth.get("/google", async(req, res) => {
    let state = req.query.state;
    let googleauth = await google.GenerateUrl(state);
    res.redirect(googleauth);
})


auth.listen(3004);
