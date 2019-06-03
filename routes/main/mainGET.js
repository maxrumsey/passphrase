const pug = require('pug');

module.exports = (req, res) => {
	res.status(200).send(pug.renderFile('pug/main.pug', {username: req.user, file: req.userAccount}))
}