module.exports = app => {
	app.get('/create', require('./createGET.js'))
	app.post('/create', require('./createPOST.js'))

	app.get('/login', require('./loginGET.js'))
	app.post('/login', require('./loginPOST.js'))

	app.get('/logout', require('./logoutGET.js'))

	app.get('/settings', require('./settingsGET.js'))
	app.post('/settings', require('./settingsPOST.js'))
}