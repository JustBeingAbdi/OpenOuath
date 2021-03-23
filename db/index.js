const StateDB = require("./Schemas/State.js"),
TokenDB = require("./Schemas/Token.js"),
srs = require("secure-random-string");


module.exports.CreateState = async(callback) => {
    let stateID = srs({length:40});
    let stateDB = new StateDB({
        state: stateID,
        callback: callback
    });
    stateDB.save();
    return stateDB;
}