import { useState } from "react";
import "../styles/login.scss";

const Login = ({ user, login, message }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<div className="login-container">
			<form className="form">
			<div className="heading">
				<h1>LOGIN</h1>
			</div>
				<div className="input-field">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						value={username}
						name="username"
						onChange={({ target: { value } }) => setUsername(value)}
					/>
				</div>
				<div className="input-field">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						value={password}
						name="password"
						onChange={({ target: { value } }) => setPassword(value)}
					/>
				</div>
				{message}
				<div className="submit-button">
					<input
						type="button"
						value="LOGIN"
						onClick={() => login({ username, password })}
					/>
				</div>
			</form>
		</div>
	);
};

export default Login;
