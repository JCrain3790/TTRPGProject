<script>

</script>

<div class="auth-container">
	<form class="auth-form" method="POST" action="?/login">
		<label>
			Email
			<input name="email" type="email" required />
		</label>
		<label>
			Password
			<input name="password" type="password" required />
		</label>
		<button type="submit">Login</button>
		<button type="button" formaction="?/signup">Sign up</button>
	</form>
</div>
<style>
:root {
				--eerie-black: #1f1e1e;
				--flame: #ec4e20;
				--orange: #ff9505;
				--sage: #b6be9c;
				--blue: #7b9e87;
				--background: var(--eerie-black);
			}	
.auth-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background-color: var(--eerie-black);
	padding: 20px;
}

.auth-form {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
	max-width: 400px;
	padding: 20px;
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

label {
	margin-bottom: 15px;
	font-weight: bold;
	color: #333;
}

input {
	width: 100%;
	padding: 10px;
	margin-top: 5px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

button {
	padding: 10px;
	margin-top: 10px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-weight: bold;
}

button[type="submit"] {
	background-color: #ff4500;
	color: white;
}

button[type="button"] {
	background-color: #ccc;
	color: #333;
}

button:hover {
	opacity: 0.9;
}

</style>
