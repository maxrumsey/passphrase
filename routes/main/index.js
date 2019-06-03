const express = require('express')

module.exports = app => {
	const router = express.Router();
	
	router.use((req, res, next) => {
		if (!req.user) {
			return res.redirect('/login')
		} else return next()
	})
 
	router.get('/', require('./mainGET.js'));
	router.post('/api/service', require('./servicePOST.js'));
	router.post('/admin-login', require('./admin-loginPOST.js'));
	router.delete('/api/service', require('./serviceDELETE.js'));
	router.get('/api/service', require('./serviceGET.js'));
	router.get('/api/services', require('./servicesGET.js'));
	router.patch('/api/service', require('./servicePATCH.js'));


	app.use('/main', router);
}