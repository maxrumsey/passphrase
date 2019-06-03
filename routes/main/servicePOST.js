const db = require('../../db')

module.exports = async (req, res) => {
	if (!req.body.name) return res.sendStatus(400);

	const user = req.userAccount;

	for (var i = 0; i < user.services.length; i++) {
		if (user.services[i].name === req.body.name) return res.status(400).json({response: 'Name already in use'})
	}

	user.services.push({
		name: req.body.name,
		url: req.body.url || ''
	})

	await db.saveDBFile(req.user, user, req.hash)
	res.sendStatus(200)
}