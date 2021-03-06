var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
var multiparty = require('multiparty');
var util = require('util');
var multer = require('multer');
var config = require('../../config/config');
var uploadFileModel = mongoose.model('UploadFile');
var h5service=require('../service/h5service');
var fs=require('fs');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, config.upload.path);
  },
  filename: function(req, file, cb) {
    console.log("file storage", file)
    return cb(null, Date.now() + "-" + file.originalname.replace('.pptx','').replace('.ppt',''));
  }
})

var upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    console.log('upload fileFilter', file);
    var ext = file.originalname.split('.')[1];
    if (ext) {
      if (ext.indexOf('ppt') != -1 || ext.indexOf('pptx') != -1) {
        return cb(null, true);
      }
    }
    return cb(null, false);
  }
});
module.exports = function(app) {
  app.use('/api', router);
};

/**
accesstoken
*/
router.post('/upload', function(req, res, next) {
  var form = new multiparty.Form({
    uploadDir: 'uploads'
  });
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {
      'content-type': 'text/plain'
    });
    res.write('received upload:\n\n');
    res.end(util.inspect({
      fields: fields,
      files: files
    }));
  });
  form.on('part', function(part) {
    console.log(part);
  });

  return;
})

/**

*/
router.post('/upload_ppt', upload.single('ppt'), function(req, res, next) {
  var json = {};

  if (req.file) {
    //权限处理
    var newfilename=Date.now()+"-"+req.file.originalname;
    var url=req.body.url||req.query.url;
    fs.chmod(req.file.path, 0777, function (err) {
      console.log(err);
      console.log('修改权限 ',req.file.path);

      fs.rename(req.file.path, req.file.destination+"/"+newfilename, function(){
        fs.unlink(req.file.path,function(){});
      });
    });

    var uploadFile = uploadFileModel();
    uploadFile.name = newfilename.split('.')[0];
    uploadFile.ext = newfilename.split('.')[1];
    uploadFile.path=req.file.destination+"/"+newfilename;
    uploadFile.date = new Date();
    uploadFile.callback_url=url;
    uploadFile.status=0; //未转换
    uploadFile.save(function(err) {});
    var fileSizeMB = Math.round(req.file.size / 1024 / 1024);
    if (fileSizeMB == 0) {
      fileSizeMB = 1;
    }
    console.log('upload success', req.file);
    json.success = 1;
    // json.fileSizeMB=fileSizeMB;
    json.fileSize = req.file.size;
    json.timeSec = 20 * fileSizeMB;
  } else {
    json.error = 1;
    json.error_msg = "只能上传ppt或者pptx文件";
  }
  res.json(json);
})

router.get('/test_check',function(req,res,next){
  h5service.check(function(){

  });
  res.json({success:1});
});

router.get('/list',function(req,res,next){
  var display={
    ext:0,
    path:0,
    status:0,
    callback_url:0,
    date: 0
  }
  uploadFileModel.find({status:1},display).sort({date:-1}).limit(5).exec(function(err,files){
    res.json(files);
  });
});
var lastCount=0;
router.get('/finish_count',function(req,res,next){
  lastCount++;
  var status=req.query.status||1;
  uploadFileModel.count({status:status},function(err,count){
    if(count==lastCount&&count!=0){//发送错误邮件
      console.log('发送错误邮件');
      var nodemailer = require('nodemailer');
      var wellknown = require('nodemailer-wellknown');
      var qqConfig = wellknown('QQ');
      var transporter=nodemailer.createTransport({
        service:'qq',
        auth:{
          'user':'3285685032@qq.com',
          'pass':'xbspyjobjqjkdbdb',//gqggrvyfbxijcicj //uepmxlhraroddajh //xbspyjobjqjkdbdb
        }
      });
      var mailOptions = {
          from: '3285685032@qq.com', // sender address
          to: '1520069327@qq.com', // list of receivers
          subject: '拉多拉系统-转换错误通知', // Subject line
          text: '很不幸，系统有可能报错了，请查看。'// plaintext bod
      };
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error);
          }
          console.log('Message sent: ' + info.response);
      });
    }
    lastCount=count;
    res.json({finish:count,lastCount:lastCount});
  });
});

router.get('/check_error',function(req,res,next){
  h5service.checkError(function(){});
  return res.json({success:1});
});

function sec(req, res, next) {
  next();
}
