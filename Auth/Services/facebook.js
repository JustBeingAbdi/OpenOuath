let queryString = require("query-string");
let config = require("../../config.json");

module.exports.GenerateFUrl = async(state) => {

return `https://www.facebook.com/v10.0/dialog/oauth?client_id=${config.facebook_clientID}&redirect_uri=https://ouath.openauth.cf/facebook/callback&state=${state}&response_type=code`
}