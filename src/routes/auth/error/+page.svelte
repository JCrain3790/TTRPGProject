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
{#if message}
	<p>{message}</p>
	{:else}
	<p>Login error Status: {status} Code: {code}</p>
{/if}

