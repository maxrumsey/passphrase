const express = require('express');
const pug = require('pug');
const db = require('../../db');

module.exports = app => {
	const router = express.Router();
	
	router.use((req, res, next) => {
		if (!req.admin || !req.user) {
			return res.redirect('/main')
		} else return next()
	})

	router.get('/', async (req, res) => {
		let users = await db.getUsers()

		let env = [
				("ADMIN=" + process.env.ADMIN).replace('\\r', ''),
				("VERIFY=" + process.env.VERIFY).replace('\\r', ''),
				("SALTROUNDS=" + process.env.SALTROUNDS).replace('\\r', ''),
				("PORT=" + process.env.PORT).replace('\\r', ''),
			].join('\n')
		res.status(200).send(pug.renderFile('pug/admin.pug', {
			env: env,
			config: JSON.stringify(process.config, null, 2),
			msg: req.query.msg || undefined,
			users: users.push()
		}))
	})
	router.post('/', require('./adminPOST.js'))


	app.use('/admin', router);
}
