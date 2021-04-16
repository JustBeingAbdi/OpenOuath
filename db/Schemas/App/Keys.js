let mongoose = require("mongoose");
let srs = require("secure-random-string");

module.exports = mongoose.model("Keys", mongoose.Schema({
    id: { type: String },
    apikey: { type: String, default: srs({length:40})},
    secretkey: { type: String, default: srs({length:40})}

}))