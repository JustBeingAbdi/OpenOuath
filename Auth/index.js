let express = require("express");
let db = require("../db");
let mongoose = require("mongoose");
let axios = require("axios");
let auth = express();
let config = require("../config.json");



auth.get("/github/callback", async(req, res) => {
    let request_token = req.query.code;

    axios.default({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${config.clientID}&client_secret=${config.clientSecret}&code=${request_token}`,
        headers: {
            accept: 'application/json'
        }
    }).then(async(response) => {
        let stateDB = await db.GetState(req.query.state);
        if(!stateDB) return res.redirect(`/ouath/error?service=github&state=${req.query.state || 'Unknown'}&message=Invalid+State`);
        
        let access_token = response.data.access_token;
        let TokenDB = await db.CreateToken(access_token);
        res.redirect(`${stateDB.callback}?code=${TokenDB.token}`);
    });
    

});
auth.get("/github", async(req, res) => {
    let state = req.query.state;
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${config.clientID}&state=${state}`);
});


auth.listen(3004);