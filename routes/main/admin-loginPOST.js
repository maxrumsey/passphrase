const db = require('../../db')

module.exports = async (req, res) => {
	if (!req.body.password) return res.sendStatus(400);

	const hash = await db.hash(req.body.password)
	const adminhash = await db.hash(process.env.ADMIN);
	if (adminhash !== hash) return res.redirect('/main?msg=Admin%20Password%20Incorrect')
	else {
		res.cookie('admin', Buffer.from(hash).toString('base64'))
		res.redirect('/admin')
	}
}
