const db = require('../../db')

module.exports = async (req, res) => {
	if (req.user) return res.redirect('/main');
	if (!process.config.PUBLIC) return res.redirect('/')

	if (!req.body.username ||
			!req.body.password1 ||
			!req.body.password2) return res.redirect('/create?msg=Missing%20Fields');
	if (!req.body.username.match(/^[A-z0-9]+$/)) return res.redirect('/create?msg=Username%20Can%20Only%20Contain%20Letters%20And%20Numbers');
	if (req.body.password1 !== req.body.password2) return res.redirect('/create?msg=Passwords%20Don\'t%20Match');
	if (await db.userExists(req.body.username)) return res.redirect('/create?msg=User%20Already%20Exists');
	
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
		throw new Error();
	}

	res.cookie('userhash', Buffer.from(req.body.username + ':' + passHash).toString('base64'));
	res.redirect('/')
}