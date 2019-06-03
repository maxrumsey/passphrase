const fs = require('fs').promises

module.exports = async (req, res) => {
	if (req.user) return res.redirect('/main');
	let msgBOX;
	if (!req.query.msg) msgBOX = ``;
	else {
		const msg = req.query.msg.replace(/%20/g, ' ');
		msgBOX = `<div class="alert alert-primary" role="alert">
  							${msg}
							</div>`
	}
	const file = (await fs.readFile('./html/login.html')).toString('utf8');
	res.send(file.replace('<<msgBOX>>', msgBOX))
}