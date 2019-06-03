const db = require('../../db')

module.exports = async (req, res) => {
	if (req.user) return res.redirect('/main');

	if (!req.body.username ||
			!req.body.username.match(/^[A-z0-9]+$/) ||
			!req.body.password) return res.redirect('/login?msg=Error%20Logging%20In');
	
	const passHash = await db.hash(req.body.password);

	try {
		await db.getDBFile(req.body.username, passHash)
	} catch (e) {
		return res.redirect('/login?msg=Incorrect%20Credentials');
	}

	res.cookie('userhash', Buffer.from(req.body.username + ':' + passHash).toString('base64'));
	res.redirect('/')
}