const mongoose = require("mongoose");

module.exports = mongoose.model("State", mongoose.Schema({
    state: { type: String},
    callback: { type: String},
}));