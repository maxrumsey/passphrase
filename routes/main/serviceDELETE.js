const db = require('../../db')

module.exports = async (req, res) => {
	if (!req.query.name) return res.sendStatus(400);

	const user = req.userAccount;
	let hit;

	for (var i = 0; i < user.services.length; i++) {
		if (user.services[i].name === req.query.name) hit = i
	}
	if (hit === undefined) return res.status(400).json({response: 'Service not found'})
	user.services.splice(hit, 1)

	await db.saveDBFile(req.user, user, req.hash)
	res.sendStatus(200)
}