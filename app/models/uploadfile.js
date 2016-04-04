var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UploadFileSchema = new Schema({
  name: String,
  ext:String,
  status:Number, //0 上传成功 1 转换完成
  date: Date
});

mongoose.model('UploadFile', UploadFileSchema);
