
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AccessTokenSchema = new Schema({
  app_id: String,
  token:String
});

mongoose.model('AccessToken', AccessTokenSchema);
