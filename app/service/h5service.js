var mongoose = require('mongoose');
var fs=require('fs');
var uploadFileModel = mongoose.model('UploadFile');
var request=require('request');
var zlib = require('zlib');
var targz = require('tar.gz');
var path = "uploads/h5/"
var check = function(cb) {
  var finalPath=__dirname.replace('app/service',"")+path;
  uploadFileModel.find({status:0}, function(err, docs) {
    docs.forEach(function(f){
      console.log(f);
      var dirpath= finalPath+f.name;
      var filepath=finalPath+f.name+"/index.html";
      console.log('file path ='+filepath);
      fs.stat(filepath, function(err,stats){
        console.log('stat err=',err);
        console.log('stat ',stats);
        if(stats!=null){//找到index
          //压缩
          var read = targz().createReadStream(dirpath);
          var write = fs.createWriteStream(path+f.name+'.tar.gz');
          read.pipe(write);

          //POST回调地址

          //更新状态
          uploadFileModel.update({_id:f.id},{$set:{status:1}},function(err,num){});
        }else{
          console.log(f.name+' 没有完成');
        }
      });
    });
    cb();
  });
}

exports.check=check;
