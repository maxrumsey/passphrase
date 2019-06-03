const readline = require('readline-sync');
const fs = require('fs');
const crypto = require('crypto');
const db = require('./db')

console.log('Initiating build')
const results = {};
async function run() {
	try {
		results.port = readline.question('Enter the port number: ');
		results.admin = readline.question('Enter the admin password: ');
		results.verify = readline.question('Enter the verification key (leave blank for random): ');
		if (results.verify == '') results.verify = crypto.randomBytes(64).toString('hex')
		results.rounds = readline.question('Enter the number of salt rounds (leave blank for 10): ');

		if (isNaN(parseInt(results.round))) results.rounds = 10;

		results.authRequired = readline.question('Require an basic HTTP authorization (Y/n)? ').toUpperCase() === 'Y';

		if (results.authRequired) results.authPassword = readline.question('Enter the HTTP authorization password: ');

		fs.writeFileSync(`./config.json`, JSON.stringify({
		  "LOGIN": (results.authRequired ? results.authPassword : false),
		  "PUBLIC": true
		}))
		fs.writeFileSync(`./.env`, 
			[`ADMIN=${results.admin}`,
			`VERIFY=${results.verify}`,
			`SALTROUNDS=${results.rounds}`,
			`PORT=${results.port}`].join('\n')
		)
		console.log('Build finished. Run `npm start` to start the server.')
		process.exit(0)
	} catch (e) {
		console.log('Error building config files.');
		console.trace(e);
		process.exit(1);
	}
}
run();