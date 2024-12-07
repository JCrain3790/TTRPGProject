<script>
// @ts-nocheck

	/** @type {import('./$types').PageData} */
	export let data;
	let p1;
	let p2;
	let match;
	let domatch = () => {
		match = p1 === p2;
	};
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form on:active={domatch} on:keyup={domatch} method="POST" action="?/resetpassword">
	<h2>New Password</h2>
	<input name="password" bind:value={p1} type="password" />
	<h2>Confirm New Password</h2>
	<input bind:value={p2} type="password" />
	<br />
	<p>
		{#if !match}
			Passwords do not match!
		{/if}
	</p>
	{#if match}
		<button type="submit">Reset Password</button>
	{/if}
</form>
