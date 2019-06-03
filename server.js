const EXPRESS = require('express');
process.config = require('./config.json')
const PATH = require('path')
require('express-async-errors');
const APP = EXPRESS();
require('dotenv').config()
require('./routes/init')(APP)
require('./routes/admin')(APP)
require('./routes/main')(APP)
require('./routes/top')(APP)
require('./routes/user')(APP)

APP.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).sendFile(PATH.resolve('./html/500.html'))
})
APP.use((req, res) => {
	res.sendFile(PATH.resolve('./html/404.html'));
})

APP.listen(process.env.PORT)
console.log('Listening on port: ' + process.env.PORT)
