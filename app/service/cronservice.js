var nodemailer = require('nodemailer');
var wellknown = require('nodemailer-wellknown');
var cron=function(){
  var spawn = require('child_process').spawn;
  var curl = spawn('curl', ['-G', 'http://localhost:3000/api/test_check']);

  curl.on('close', (code) => {
    console.log(`检查文件是否转换成功`);
  });
}
var checkFinish=function(){
  var config = wellknown('QQ');
  var spawn = require('child_process').spawn;
  var curl = spawn('curl', ['-G', 'http://localhost:3000/api/finish_count?status=0']);

  curl.on('close', (code) => {
    console.log(`已查看转换服务器是否正常`);
  });
}
setInterval(cron,2000);
setInterval(checkFinish,1000*60*2);
