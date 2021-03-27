let queryString = require("query-string");
let config = require("../../config.json");

module.exports.GenerateFUrl = async(state) => {
const stringifiedParams = queryString.stringify({
  client_id: config.facebook_clientID,
  redirect_uri: 'https://ouath.openauth.cf/facebook/callback',
  scope: ['email'].join(','), // comma seperated string
  response_type: 'code',
  auth_type: 'rerequest',
  display: 'popup',
  state: state
  
});
return `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`
}