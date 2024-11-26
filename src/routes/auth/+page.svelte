<script>

</script>

<div class="auth-container">
	
	<form class="auth-form" method="POST" action="?/login">
		<h2 style="text">Login</h2>
		<label>
			Email
			<input name="email" type="email" required />
		</label>
		<label>
			Password
			<input name="password" type="password" required />
		</label>
		<button type="submit">Login</button>
		<button type="submit" formaction="?/signup">Sign up</button>
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
	padding: 16px;
}

.auth-form {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
	max-width: 400px;
	padding: 32px;
	background-color: #272727;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

label {
	margin-bottom: 15px;
	font-weight: bold;
	color: #616161;
}

input {
	background-color: #5b5b5b;
	width: 100%;
	padding: 10px;
	margin-top: 5px;
	border: 1px solid #5b5b5b;
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
	color: rgb(34, 34, 34);
}

button:hover {
	opacity: 0.9;
}

</style>
