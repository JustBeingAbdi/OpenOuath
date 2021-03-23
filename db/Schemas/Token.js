const mongoose = require("mongoose");
const srs = require("secure-random-string");

module.exports = mongoose.model("Access_Token", mongoose.Schema({
    token: { type: String},
    access_token: { type: String, default: srs({length:40})},
}));