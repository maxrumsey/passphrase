const pug = require('pug');

module.exports = (req, res) => {
	if (!req.user) return res.redirect('/login');

	res.status(200).send(pug.renderFile('pug/settings.pug', {msg: req.query.msg || undefined}))
}