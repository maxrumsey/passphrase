const db = require('../../db')

module.exports = async (req, res) => {
	console.log(req.body)
	if (!req.body.name ||
			!req.query.name ||
			!req.body.passwords) return res.sendStatus(400);
	const user = req.userAccount;
	
	let origService;
	for (var i = user.services.length - 1; i >= 0; i--) {
		if (user.services[i].name === req.query.name) {
			origService = user.services[i];
			user.services.splice(i, 1)
		}
	}
	if (origService === undefined) return res.status(400).json({response: 'Service not found'})

	for (var i = user.passwords.length - 1; i >= 0; i--) {
		if (user.passwords[i].service === req.query.name) user.passwords.splice(i, 1)
	}
	
	for (var i = req.body.passwords.length - 1; i >= 0; i--) {
		req.body.passwords[i].service = req.body.name
		user.passwords.push(req.body.passwords[i]);
	}

	origService.name = req.body.name;
	origService.url = req.body.url;

	user.services.push(origService)

	await db.saveDBFile(req.user, user, req.hash)
	res.sendStatus(200)
}