const db = require('../../db')

module.exports = async (req, res) => {
	if (!req.query.name) return res.sendStatus(400);

	let service;

	for (let i = 0; i < req.userAccount.services.length; i++) {
		if (req.userAccount.services[i].name === req.query.name) {
			service = req.userAccount.services[i]
			break;
		}
	}
	if (service === undefined) return res.status(400).json({response: 'Service not found'})
	service.passwords = [];

	for (var j = req.userAccount.passwords.length - 1; j >= 0; j--) {
		if (req.userAccount.passwords[j].service === req.query.name) service.passwords.push(req.userAccount.passwords[j])
	}

	res.status(200).json(service)
}