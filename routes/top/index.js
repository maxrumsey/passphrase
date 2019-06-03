const fs = require('fs').promises;

module.exports = app => {
	app.get('/', async (req, res) => {
		if (req.user) return res.redirect('/main');
		let file = (await fs.readFile('./html/index.html')).toString('utf8');
		if (!process.config.PUBLIC) file = file.replace(`<a href='/create' class='btn btn-primary' id='createButton'>Create Account</a>`, ``)
		res.status(200).send(file)
	})
}