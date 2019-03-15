if(process.env.NODE_ENV == 'production'){
  module.exports = {
    mongoURI : 'mongodb://zaytt:password1@ds151612.mlab.com:51612/zaytt-vidjot-prod'
  }
} else {
  module.exports = {
    mongoURI : 'mongodb://localhost/vidjot-dev'
  }
}