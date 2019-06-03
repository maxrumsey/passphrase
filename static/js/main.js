var currentService;

window.addEventListener('load', load)

function load() {
	document.getElementById('loader').classList.add('disabled')
}
async function servicePopup(name) {
	document.getElementById('main').disabled = true;
	document.getElementById('main').style.opacity = 0.4;
	document.getElementById('main').style['pointer-events'] = 'none';
	let data
	try {
		data = await axios.get('/main/api/service?name=' + name);
	} catch (e) {
		return alert(e.response.data.response || e)
	}
	document.getElementById('serviceInfo').style.display = 'block';
	document.getElementById('serviceInfo').disabled = false;
	document.getElementById('serviceInfo').style['pointer-events'] = 'auto';

	document.getElementById('serviceInfo-name').value = name;
	document.getElementById('serviceInfo-url').value = data.data.url;
	const entryBox = document.getElementById('serviceInfo-entries');
	while (entryBox.hasChildNodes()) {
  	entryBox.removeChild(entryBox.lastChild);
	}
	for (var i = data.data.passwords.length - 1; i >= 0; i--) {
		const pass = data.data.passwords[i]
		const li = document.createElement('li')
		const p = document.createElement('p')
		p.innerHTML = `Account: <input type='text' class='serviceInfo-userbox form-control' value='${pass.username}'> Password: <input type='text' class='serviceInfo-passbox form-control' value='${pass.password}'> URL: <input class='serviceInfo-urlbox form-control' type='text' value='${pass.url || ''}'> <button class="btn btn-danger marginTopButton" onclick='servicePopupDeletePassword(this)'>Delete</button>`
		li.appendChild(p)
		entryBox.appendChild(li)
	}
	const li = document.createElement('li')
	const p = document.createElement('p')
	p.innerHTML = `Account: <input class='serviceInfo-userbox form-control' id='servicePopupInputPassUsername' type='text' placeholder='Account Name'> Password: <input class='serviceInfo-passbox form-control' id='servicePopupInputPassPassword' type='text' placeholder='Password'> URL: <input id='servicePopupInputPassURL' class='serviceInfo-urlbox form-control' type='text' placeholder='URL'> <button class="btn btn-primary marginTopButton" onclick='servicePopupAddPassword()'>Add Password</button>`
	li.id = 'servicePopupAddPassword'
	li.appendChild(p)
	entryBox.appendChild(li)
	currentService = data.data;
}

async function servicePopupAddPassword() {
	const user = document.getElementById('servicePopupInputPassUsername');
	const pass = document.getElementById('servicePopupInputPassPassword');
	const url = document.getElementById('servicePopupInputPassURL');

	if (!user.value || !pass.value) return alert('Username and Password not present')

	const entryBox = document.getElementById('serviceInfo-entries');

	const li = document.createElement('li')
	const p = document.createElement('p')
	const finalLi = document.getElementById('servicePopupAddPassword');
	p.innerHTML = `Account: <input type='text' class='serviceInfo-userbox form-control' value='${user.value}'> Password: <input type='text' class='serviceInfo-passbox form-control' value='${pass.value}'> URL: <input type='text' class='serviceInfo-urlbox form-control' value='${url.value || ''}'> <button class="btn btn-error marginTopButton" onclick='servicePopupDeletePassword(this)'>Delete</button>`
	li.appendChild(p)
	entryBox.insertBefore(li, finalLi)
	saveServicePopup()
}
function servicePopupDeletePassword(e) {
	e.parentElement.parentElement.remove();
	saveServicePopup()
}
async function closeServicePopup() {
	document.getElementById('serviceInfo').style.display = 'none';
	document.getElementById('serviceInfo').disabled = true;
	document.getElementById('serviceInfo').style['pointer-events'] = 'none';
	restructureMain()
	document.getElementById('main').disabled = false;
	document.getElementById('main').style.opacity = 1;
	document.getElementById('main').style['pointer-events'] = 'auto';

}
async function saveServicePopup() {

	const usernames = [].slice.call(document.getElementsByClassName('serviceInfo-userbox'));
	const passwords = [].slice.call(document.getElementsByClassName('serviceInfo-passbox'));
	const URLs = [].slice.call(document.getElementsByClassName('serviceInfo-urlbox'));
	const origName = document.getElementById('serviceInfo-name').value;
	currentService.url = document.getElementById('serviceInfo-url').value
	let list = [];

	if ((usernames.length !== passwords.length) || (passwords.length !== URLs.length)) return alert('Error: Input Mismatch')

	if (usernames.length <= 1) currentService.passwords = [];
	else {
		usernames.pop();
		passwords.pop();
		URLs.pop()

		for (var i = usernames.length - 1; i >= 0; i--) {
			list.push({
				username: usernames[i].value,
				password: passwords[i].value,
				url: URLs[i].value
			})
		}
		currentService.passwords = list;
	}
	try {
		await axios.patch('/main/api/service?name=' + origName, currentService)
	} catch (e) {
		alert (e.response.data.response || e)
	}
}
async function deleteService() {
	try {
		await axios.delete('/main/api/service?name=' + currentService.name)
	} catch (e) {
		alert (e.response.data.response || e)
	}
	closeServicePopup()
}
async function createServicePopup() {
	document.getElementById('main').disabled = true;
	document.getElementById('main').style.opacity = 0.4;
	document.getElementById('main').style['pointer-events'] = 'none';

	document.getElementById('createService').style.display = 'block';
	document.getElementById('createService').disabled = false;
	document.getElementById('createService').style['pointer-events'] = 'auto';

	document.getElementById('createService-name').value = '';
	document.getElementById('createService-url').value = '';
}
function closeCreateServicePopup() {
	document.getElementById('createService').style.display = 'none';
	document.getElementById('createService').disabled = true;
	document.getElementById('createService').style['pointer-events'] = 'none';
	restructureMain()
	document.getElementById('main').disabled = false;
	document.getElementById('main').style.opacity = 1;
	document.getElementById('main').style['pointer-events'] = 'auto';

}
async function createCreateServicePopup() {
	const name = document.getElementById('createService-name').value;
	const url = document.getElementById('createService-url').value;

	if (!name) return alert('Name value not present.')

	try {
		await axios.post('/main/api/service', {name, url});
		closeCreateServicePopup()
	} catch (e) {
		console.log(e)
		return alert(e.response.data.response)
	}
}
async function restructureMain() {
	let services;
	try {
		services = (await axios.get('/main/api/services')).data
	} catch (e) {
		return alert(e.response.data.response || e)
	}
	const servicesDiv = document.getElementById('servicesDiv')
	while (servicesDiv.hasChildNodes()) {
  	servicesDiv.removeChild(servicesDiv.lastChild);
	}

	for (var i = services.length - 1; i >= 0; i--) {
		const div = document.createElement('div');
		div.classList.add('website-card')
		div.innerHTML = `<h2>${services[i].name}</h2>`
		if (services[i].url) div.innerHTML += `<p>URL: ${services[i].url}</p>`
		div.innerHTML += `<button class="btn btn-primary" onclick='${'servicePopup("' + services[i].name + '")'}'>Open</button>`
		servicesDiv.appendChild(div)
	}

}