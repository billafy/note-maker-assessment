import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

import Login from "./components/Login";
import NoteMaker from "./components/NoteMaker";
import urls from "./utils/urls";

const App = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState({});
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [message, setMessage] = useState("");

	const login = async ({ username, password }) => {
		if (!username || !password) return setMessage("Fill all the fields");
		let response;
		try {
			response = await axios.post(
				urls.login,
				{ username, password },
				{ withCredentials: true }
			);
			setMessage(response.data.body.message);
			if (response.data.success) {
				setUser(response.data.body.user);
				setIsLoggedIn(true);
				navigate("/");
			}
		} catch (err) {
			setMessage(response.data.body.message);
		}
	};

	const logout = async () => {
		try {
			const response = await axios.delete(
				urls.logout,
				{ withCredentials: "include" }
			);
			window.location.reload();
		} catch {}
	};

	const refresh = async () => {
		let response;
		try {
			const response = await axios.put(
				urls.refresh,
				{},
				{ withCredentials: true }
			);
			if (response.data.success) {
				setUser(response.data.body.user);
				setIsLoggedIn(true);
				navigate("/");
			}
		} catch {}
	};

	useEffect(() => {
		setTimeout(() => {
			setMessage('');
		}, 3000);
	}, [message]);

	useEffect(() => {
		refresh();
	}, []);

	return (
		<div className="app-container">
			<div className={`message-popup ${message ? 'show-message' : 'hide-message'}`}>
				<p>{message}</p>
			</div>
			<Routes>
				<Route
					path="/login"
					element={
						isLoggedIn ? (
							<Navigate to="/" />
						) : (
							<Login
								user={user}
								login={login}
							/>
						)
					}
				/>
				<Route
					path="/"
					element={
						isLoggedIn ? (
							<NoteMaker user={user} logout={logout} setMessage={setMessage} />
						) : (
							<Navigate to="/login" />
						)
					}
				/>
			</Routes>
		</div>
	);
};

export default App;
