var cron=function(){
  var spawn = require('child_process').spawn;
  var curl = spawn('curl', ['-G', 'http://localhost:3000/test_check']);

  curl.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

setInterval(cron,2000);
