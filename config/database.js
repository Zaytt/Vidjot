if(process.env.NODE_ENV == 'production'){
  module.exports = {
    mongoURI : 'mongodb://{user}:{password}@ds151612.mlab.com:51612/zaytt-vidjot-prod'
  }
} else {
  module.exports = {
    mongoURI : 'mongodb://localhost/vidjot-dev'
  }
}