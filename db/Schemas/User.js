let mongoose = require("mongoose");

module.exports = mongoose.model("User", mongoose.Schema({
    token: { type: String},
    email: { type: String},
    password: { type: String},
    type: { type: String},
}))