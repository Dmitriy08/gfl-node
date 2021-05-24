document.addEventListener('DOMContentLoaded', () => {
	const username = window.location.pathname;
	const dirs = document.querySelectorAll('[data-type="dir"]')
	let tableBody = document.querySelector('.table tbody');

	dirs.forEach(dir => {
		dir.addEventListener('click', (e)=> {
			console.log('dir')
		})
	})

	const makeRender = (selector) => {
		let template = document.querySelector(selector).innerHTML;
		return new Function('data', 'return `' + template + '`');
	}


	const renderTableBody = ({userFiles}) => {
		tableBody.innerHTML = '';
		let listRender = makeRender('.tableBody');
		let template = userFiles.map((data) => listRender(data))
		tableBody.innerHTML = (template.join(''))
	}


	const getRequest = async (url) => {
		let res = await fetch(url)
		if (!res.ok) throw new Error('Error - ' + res.status);
		const response = await res.json()
		return await response;
	}
	getRequest(`http://localhost:3010${username}-file/`).then(data => renderTableBody(data))
})