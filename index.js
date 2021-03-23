let express = require("express");
let db = require("./db");
let mongoose = require("mongoose");
let api = express();
let openouath = require("openauth");

api.use(async(req, res, next) => {
    req.database = db;
    next();
});


let config = require("./config.json");
api.post("/github/generate/url", async(req, res) => {
    let stateDB = await db.CreateState(req.body.callback);

    return res.status(200).send({
        message: "Generated",
        url: `${config.url}/ouath/github?state=${stateDB.state}`,
    });
});
api.get("/test", async(req, res) => {
    openouath.GetGithubUrl("https://example.com/callback");
});


api.listen(3003)

mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
