var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ldl-ppth5'
    },
    upload:{
      path:'uploads',
      h5path:'uploads/h5/',
      errorPath:'/data/ppterror/'
    },
    mail:{
      user:'3285685032@qq.com',
      pass:'123456'
    },
    port: 3000,
    db: 'mongodb://localhost/ldl-ppth5-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ldl-ppth5'
    },
    upload:{
      path:'uploads',
      h5path:'uploads/h5',
      errorPath:'/data/ppterror/'
    },
    mail:{
      user:'3285685032@qq.com',
      pass:'123456'
    },
    port: 3000,
    db: 'mongodb://localhost/ldl-ppth5-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ldl-ppth5'
    },
    upload:{
      path:'uploads',
      h5path:'uploads/h5',
      errorPath:'/data/ppterror/'
    },
    mail:{
      user:'3285685032@qq.com',
      pass:'123456'
    },
    port: 3000,
    db: 'mongodb://localhost/ldl-ppth5-production'
  }
};

module.exports = config[env];
