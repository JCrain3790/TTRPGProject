<script>
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data;
	// @ts-ignore
	$: ({ session, supabase } = data);

	let text = 'testing';

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((newSession) => {
			// @ts-ignore
			let nsea;
			let sea;
			if (newSession) {
				nsea = newSession.expires_at;
			}
			if (session) {
				sea = session.expires_at;
			}
			if (nsea !== sea) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		console.log('logout hit');
		if (error) {
			console.error(error);
		}
		invalidateAll();
	};

	async function login() {
		goto('/auth');
	}

	export let loginFunction = () => {
		goto('/auth');
	}
</script>

<nav class="navbar">
	<div class="nav-links">
		<a href="/" style="color: var(--flame); font-size: 20pt" >LOREFORGE</a>
	</div>
	<div class="nav-links" style="justify-content:end">
		
	</div>
	<div class="auth nav-links">
		<a href="/features">Features</a>
		<a href="/about">About</a>
		{#if session}
			<a href="/user/{session.user.id}/campaign">Campaigns</a>
			<a href="">{session.user.email}</a>
			<button on:click={logout} type="submit">Logout</button>
		{:else if $page.url.pathname !== '/auth'}
			<button on:click={login} type="submit">Login</button>
		{/if}
	</div>
</nav>

<slot parentprop={text}></slot>

<style>
	:root {
		--eerie-black: #1f1e1e;
		--flame: #ec4e20;
		--orange: #ff9505;
		--sage: #b6be9c;
		--blue: #7b9e87;
		--background: var(--eerie-black);
	}
</style>
