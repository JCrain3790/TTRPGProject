<script>
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	/**
	 * @type {string}
	 */
	let status = ''
	let code = ''
	let message = ''

	onMount(() => {
		let params = new URLSearchParams(window.location.search);
		status = params.get('status') ?? '';
		code = params.get('code') ?? '';
		message = params.get('message') ?? '';
		console.log(params);
	});
</script>
<div style="display: flex; justify-content:center; align-items:center; min-height:400px;">
{#if message}
	<pre style="text-align:center;">{message}</pre>
	{:else}
	<p>Login error Status: {status} Code: {code}</p>
{/if}
</div>

