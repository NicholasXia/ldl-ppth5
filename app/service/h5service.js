var mongoose = require('mongoose');
var fs = require('fs');
var uploadFileModel = mongoose.model('UploadFile');
var request = require('request');
var zlib = require('zlib');
var targz = require('tar.gz');
var config = require('../../config/config');
var fsExtra = require('fs-extra');
var path = config.upload.path;
var h5path = config.upload.h5path;
var check = function(cb) {
  var finalPath = __dirname.replace('app/service', "") + path;
  uploadFileModel.find({
    status: 0
  }, function(err, docs) {
    docs.forEach(function(f) {
      console.log(f);
      var dirpath = h5path + f.name + " (Web)";
      var filepath = dirpath + "/index.html";
      console.log('file path =' + filepath);
      fs.stat(filepath, function(err, stats) {
        console.log('stat err=', err);
        console.log('stat ', stats);
        if (stats != null) { //找到index
          //重命名
          var newDirPath=h5path + f.name;
          fs.rename(dirpath, newDirPath, function(err){
            if (err) return console.error(err)
            console.log("rename ldlh5 success!")
          });

          //Copy js
          fsExtra.copy(global.PROJECT_URI+'/public/js/ldlh5.js', newDirPath+"/ldlh5.js", function(err) {
            if (err) return console.error(err)
            console.log("copy ldlh5 success!")
          });



          //压缩
          var read = targz().createReadStream(dirpath);
          console.log('tar.gz=', h5path + f.name + '.tar.gz')
          var write = fs.createWriteStream(h5path + f.name + '.tar.gz');
          read.pipe(write);
          var zipName=f.name + '.tar.gz';
          //POST回调地址
          var callback_url=f.callback_url;
          var form={
            name:f.name,
            ext:f.ext,
            date:f.date,
            path_url:'http://123.56.184.87:8000/'+zipName
          }
          request.post({url:callback_url, form: form}, function(err,httpResponse,body){
            console.log('post 回调 ',body);
          })


          //更新状态
          uploadFileModel.update({
            _id: f.id
          }, {
            $set: {
              status: 1
            }
          }, function(err, num) {});
        } else {
          console.log(f.name + ' 没有完成');
        }
      });
    });
    cb();
  });
}

exports.check = check;
