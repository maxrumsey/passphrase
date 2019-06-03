const DB = require('../../db')
const cookie = require('cookie-parser')
const bodyParser = require('body-parser');
const express = require('express');

module.exports = app => {
	app.use(cookie())
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use('/static', express.static('static'))
	app.use((req, res, next) => {
		if (!process.config.LOGIN) return next()
	  // -----------------------------------------------------------------------
	  // authentication middleware


	  // parse login and password from headers
	  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
	  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

	  // Verify login and password are set and correct
	  if (password && (password === process.config.LOGIN)) {
	    // Access granted...
	    return next()
	  }

	  // Access denied...
	  res.set('WWW-Authenticate', 'Basic realm="Enter Global Access Password"') // change this
	  res.status(401).send('Enter Global Access Password') // custom message

	  // -----------------------------------------------------------------------

	})
	app.use(async (req, res, next) => {

		if (!req.cookies.userhash) req.user = null;
		else{
			const hashArr = Buffer.from(req.cookies.userhash, 'base64').toString('utf8').split(':');

			if (hashArr.length !== 2) req.user = null;
			else {
				const user = hashArr[0]
				const pass = hashArr[1]

				let file;
				try {
					file = await DB.getDBFile(user, pass);
				} catch (e) {
					req.user = null;
					return next()
				}
				req.user = user;
				req.userAccount = file;
				req.hash = pass;
				return next()
			}
		}
		return next()
	})
	app.use(async (req, res, next) => {
		req.admin = null;
		if (!req.cookies.admin) return next()
		else{
			const hash = Buffer.from(req.cookies.admin, 'base64').toString('utf8')
			const adminhash = await DB.hash(process.env.ADMIN);
			if (adminhash !== hash) return next()
			req.admin = true;
		}
		return next()
	})
}
