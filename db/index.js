const fs = require('fs');
const Cryptr = require('cryptr');
const path = require('path');
const sha512 = require('js-sha512').sha512;

exports.getDBFile = async (name, key) => {
	return (await openDBFile(path.resolve(`./data/${name}.enc`), key))
}
exports.deleteAccount = async (name) => {
	return await fs.promises.unlink(path.resolve(`./data/${name}.enc`))
}
exports.saveDBFile = async (name, json, key) => {
	await saveDBFile(path.resolve(`./data/${name}.enc`), json, key)
}
exports.getUsers = async () => {
	return (await fs.promises.readdir('./data/'));
}
exports.hash = (pass) => {
	let hash = pass;
	for (var i = parseInt(process.env.SALTROUNDS) - 1; i >= 0; i--) {
		hash = sha512(hash)
	}
	return hash;
}
exports.userExists = async (user) => {
	try {
		const res = await fs.promises.access(`./data/${user}.enc`, fs.constants.F_OK)
		console.log(res)
	} catch (e) {
		return false;
	}
	return true;
}
exports.writeRoot = async (name, content) => {
	return new Promise((res, rej) => {
		fs.writeFile(`./${name}`, content, (e) => {
			if (e) {
				return rej(e);
			} else res()
		})
	})
}

async function openDBFile(filename, key) {
	return new Promise((res, rej) => {
		fs.readFile(filename, (e, d) => {
			if (e) return rej(e);
			else {
				const encoded = d.toString();
				let parsedJSON;
				try {
					const decrypted = decrypt(encoded, key)
					parsedJSON = JSON.parse(decrypted);
					if (parsedJSON.key !== process.env.VERIFY) throw new Error();
				} catch (e) {
					return rej(e)
				}
				res(parsedJSON)
			}
		})
	})
}

async function saveDBFile(filename, data, key) {
	return new Promise((res, rej) => {
		const enc = encrypt(JSON.stringify(data), key);
		fs.writeFile(filename, enc, (e) => {
			if (e) {
				return rej(e);
			} else res()
		})
	})
}

function decrypt(raw, key) {
	const cryptr = new Cryptr(key);
	const output = cryptr.decrypt(raw + '');

	return output;
}

function encrypt(str, key) {
	const cryptr = new Cryptr(key);
	const output = cryptr.encrypt(str + '');

	return output;
}
