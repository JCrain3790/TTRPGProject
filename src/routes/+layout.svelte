<script>
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data;
	// @ts-ignore
	$: ({ session, supabase } = data);

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
</script>

<nav class="navbar">
	<div class="nav-links">
		<a href="/">LoreForge</a>
		<a href="/features">Features</a>
		<a href="/about">About</a>
	</div>
	<div class="auth">
		{#if session}
			<a href="/user/{session.user.id}/campaign">Campaigns</a>
			<a href="">{session.user.email}</a>
			<button on:click={logout} type="submit">Logout</button>
		{:else if $page.url.pathname !== '/auth'}
			<button on:click={login} type="submit">Login</button>
		{/if}
	</div>
</nav>



<slot></slot>
