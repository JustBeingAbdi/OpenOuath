let express = require("express");
let db = require("../db");
let mongoose = require("mongoose");
let api = express();
let axios = require("axios");
let facebook = require("../Auth/Services/facebook");
let google = require("../Auth/Services/google");



api.use(async(req, res, next) => {
    req.database = db;
    next();
});
let config = require("../config.json");
api.post("/github/generate/url", async(req, res) => {
    let stateDB = await db.CreateState(req.body.callback);

    return res.status(200).send({
        message: "Generated",
        url: `https://ouath.openauth.cf/github/?state=${stateDB.state}`,
    });
});
api.get("/github/generate/url", async(req, res) => {
    let stateDB = await db.CreateState(req.query.callback);

    return res.status(200).send({
        message: "Generated",
        url: `https://ouath.openauth.cf/github/?state=${stateDB.state}`,
    });
});
api.all("/facebook/generate/url", async(req, res) => {
    let stateDB = await db.CreateState(req.query.callback);

    return res.status(200).send({
        message: "Generated",
        url: `https://ouath.openauth.cf/facebook?state=${stateDB.state}`
    });
});
api.all("/google/generate/url", async(req, res) => {
    let stateDB = await db.CreateState(req.query.callback);
    return res.status(200).send({
        message: 'Generated',
        url: `https://ouath.openauth.cf/google?state=${stateDB.state}`
    });
})

api.get("/", async(req, res) => {
    res.redirect(`https://openauth.cf`);
});

api.get("/github/get/user", async(req, res) => {
    let access_token = req.query.access_token;
    if(!access_token) return res.status(404).end();

    let tokenDB = await db.FindToken(access_token);
    axios.default({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + tokenDB.access_token
    }
  }).then(async(response) => {
      res.send(response.data);
  })
});
api.get("/google/get/user", async(req,res) => {
    let access_token = req.query.access_token;
    if(!access_token) return res.status(404).end();

    let tokenDB = await db.FindToken(access_token);
    let googledata = await google.GetUser(tokenDB.access_token);
    res.send(googledata);
})
api.get("/facebook/get/user", async(req, res) => {
    let access_token = req.query.access_token;
    if(!access_token) return res.status(404).end();

    let tokenDB = await db.FindToken(access_token);

    axios.default({
        url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: tokenDB.access_token,
    },
    }).then(async(response) => {
        return res.send(response.data);
    })
})

api.listen(3003)

mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
