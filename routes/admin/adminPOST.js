const db = require('../../db');

module.exports = async (req, res) => {
	if (!req.body.type) return res.redirect('/admin?msg=Malformed%20Input');
	if (req.body.type === 'config') {
		if (!req.body.env || !req.body.config) return res.redirect('/admin?msg=Malformed%20Input');
		const envSPLIT = req.body.env.split('\n');
		for (var i = envSPLIT.length - 1; i >= 0; i--) {
			const key = envSPLIT[i].split('=')[0]
			const value = envSPLIT[i].split('=')[1].replace('\r', '')

			process.env[key] = value
		}
		try {
			const json = JSON.parse(req.body.config)
			process.config = json;
			await db.writeRoot('.env', req.body.env)
			await db.writeRoot('config.json', req.body.config)
		} catch (e) {
			return res.redirect('/admin?msg=Malformed%20Input')
		}
		res.redirect('/admin')
	} else if (req.body.type === 'delete') {
		if (!req.body.username) return res.redirect('/admin?msg=Missing%20Username');

		if (!(await db.userExists(req.body.username))) return res.redirect('/admin?msg=User%20not%20found');
		await db.deleteAccount(req.body.username);
		return res.redirect('/admin?msg=User%20Deleted')
	} else if (req.body.type === 'user') {
		if (!req.body.username ||
			!req.body.password1 ||
			!req.body.password2) return res.redirect('/admin?msg=Missing%20Fields');
		if (!req.body.username.match(/^[A-z0-9]+$/)) return res.redirect('/admin?msg=Username%20Can%20Only%20Contain%20Letters%20And%20Numbers');
		if (req.body.password1 !== req.body.password2) return res.redirect('/admin?msg=Passwords%20Don\'t%20Match');
		if (await db.userExists(req.body.username)) return res.redirect('/admin?msg=User%20Already%20Exists');
		
		const passHash = await db.hash(req.body.password1);
		try {
			await db.saveDBFile(req.body.username, {
				key: process.env.VERIFY,
				passwords: [],
				user: {},
				services: []
			}, passHash)
		} catch (e) {
			console.log(e);
			throw new Error(e)
		}
		res.redirect('/admin?msg=Account%20Created')
	} else return res.redirect('/admin?msg=Malformed%20Input');
}