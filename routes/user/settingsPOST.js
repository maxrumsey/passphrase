const db = require('../../db')

module.exports = async (req, res) => {
	if (!req.user) return res.redirect('/login');
	if (!req.body.type) return res.sendStatus(400);
	
	if (req.body.type === 'password') {
		if (!req.body.origpassword || !req.body.password2 || !req.body.password1) return res.sendStatus(400);

		const passHash = await db.hash(req.body.origpassword);
		const passHash2 = await db.hash(req.body.password1);

		try {
			await db.getDBFile(req.user, passHash)
		} catch (e) {
			return res.redirect('/settings?msg=Password%20Not%20Valid');
		}
		if (req.body.password1 !== req.body.password2) return res.redirect('/settings?msg=Passwords%20Not%20Equal');
		await db.saveDBFile(req.user, req.userAccount, passHash2)
		res.cookie('userhash', Buffer.from(req.user + ':' + passHash2).toString('base64'));
		return res.redirect('/settings')
	} else if (req.body.type === 'delete') {
		if (!req.body.password) return res.sendStatus(400);
		res.cookie('userhash', '')
		const passHash = await db.hash(req.body.password);

		try {
			await db.getDBFile(req.user, passHash)
		} catch (e) {
			return res.redirect('/settings?msg=Password%20Not%20Valid');
		}
		await db.deleteAccount(req.user);
		return res.redirect('/')
	} else {
		res.sendStatus(400)
	}
}