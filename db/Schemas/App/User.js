let mongoose = require("mongoose");
let srs = require("secure-random-string");

module.exports = mongoose.model("User", mongoose.Schema({
    token: { type: String, default: srs({length:50})},
    name: { type: String},
    email: { type: String},

    password: { type: String},
    ouath: { type: Boolean},
    emails: { type: Array},
    con: { type: Boolean, default: false}
    
}))