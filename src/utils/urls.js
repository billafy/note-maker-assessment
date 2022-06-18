const API = process.env.REACT_APP_API;

const urls = {
	login: `${API}/auth/login`,
	refresh: `${API}/auth/refresh`,
	logout: `${API}/auth/logout`,
	notes: `${API}/notes`,
};

export default urls;