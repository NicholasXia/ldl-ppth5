
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AppSchema = new Schema({
  name: String, //应用名
  appkey: String, //appkey
  appsecret: String, //appsecret
  callback_url:String //callback 
});

mongoose.model('App', AppSchema);
