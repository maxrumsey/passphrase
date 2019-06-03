const db = require('../../db')

module.exports = async (req, res) => {
	res.status(200).json(req.userAccount.services)
}