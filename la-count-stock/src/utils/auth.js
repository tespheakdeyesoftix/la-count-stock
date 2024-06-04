import {loginApi} from './index.js'
export default class Auth {
	constructor() {
		this.isLoggedIn = false;
		this.user = null;
		this.user_image = null;
		this.cookie = null;

		this.cookie = Object.fromEntries(
			document.cookie
				.split('; ')
				.map((part) => part.split('='))
				.map((d) => [d[0], decodeURIComponent(d[1])])
		);

		this.isLoggedIn = this.cookie.user_id && this.cookie.user_id !== 'Guest';
	}
	
	async login(email, password) {
        return new Promise(async (resolve) => {
           	await loginApi('api/method/erpnext.api.login', {
                usr: email,
                pwd: password,
            }).then((res)=>{
				if (res) {
					this.isLoggedIn = true;
					localStorage.setItem("_authentication", JSON.stringify(res));
					resolve(res);
				}
			});
			resolve(false);
		}).catch(err => {
            reject(err)
        });

	}

	async logout() {
		return new Promise(async (resolve) => {

			await call('logout');
			this.isLoggedIn = false;
			resolve(true);
		});
	}

	async resetPassword(email) {
		console.log('resetting password');
		// Implement if you want
	}
}
