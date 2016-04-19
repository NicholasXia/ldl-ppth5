var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UploadFileSchema = new Schema({
  name:String,
  ext:String,
  path:String,
  status:Number, //0 上传成功 1 转换完成
  callback_url:String,//单文件回调地址
  date: Date
});

UploadFileSchema.set('toJSON',{virtuals:true});
UploadFileSchema.virtual('url').get(function(){
  return 'http://123.56.184.87:8000/'+this.name+".tar.gz";
});
mongoose.model('UploadFile', UploadFileSchema);
