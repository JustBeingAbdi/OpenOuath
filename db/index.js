const StateDB = require("./Schemas/State.js"),
TokenDB = require("./Schemas/Token.js"),
srs = require("secure-random-string"),
UserDB = require("./Schemas/User.js");

// State Database
module.exports.CreateState = async(callback) => {
    let stateID = srs({length:40});
    let stateDB = new StateDB({
        state: stateID,
        callback: callback
    });
    stateDB.save();
    return stateDB;
}
module.exports.CreateCustomState = async(state, callback) => {
    
    let stateDB = new StateDB({
        state: state,
        callback: callback
    });
    stateDB.save();
    return stateDB;
}
module.exports.GetState = async(state) => {
    let stateDB = await StateDB.findOne({state: state});
    if(stateDB) return stateDB;
}

// Access_Token Database
module.exports.CreateToken = async(access_token) => {
    let tokenID = srs({length:20});
    let tokenDB = new TokenDB({
        token: tokenID,
        access_token: access_token
    });
    tokenDB.save();
    return tokenDB;
}
module.exports.FindToken = async(token) => {
    let tokenDB = await TokenDB.findOne({token: token});
    if(tokenDB) return tokenDB;
};

// User Database

module.exports.CreateUser = async(email, password, type) => {
    let userDB = new UserDB({
        token: srs({length:40}),
        email: email,
        password: password,
        type: type
    });
    userDB.save();
    return userDB;
}

module.exports.GetUserViaToken = async(token) => {
    let userDB = await UserDB.findOne({token: token});
    if(userDB) return userDB;
}