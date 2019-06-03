const db = require('../../db')

module.exports = async (req, res) => {
	if (!req.user) return res.redirect('/');
	
	res.cookie('userhash', '');
	res.redirect('/login')
}