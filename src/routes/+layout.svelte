<script>
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data;
	// @ts-ignore
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(
			(newSession) => {
				// @ts-ignore
                let nsea;
                let sea;
                if (newSession){
                    nsea = newSession.expires_at;
                }
                if (session){
                    sea = session.expires_at;
                    console.log(session)
                }
				if (nsea !== sea) {
					invalidate('supabase:auth');
				}
			}
		);

		return () => data.subscription.unsubscribe();
	});

$: logout = async () => {
    const { error } = await supabase.auth.signOut();
    console.log('logout hit')
    if (error) {
        console.error(error);
    }
    invalidateAll()
};

async function login(){
    goto('/auth');
}
</script>

<nav style="background-color: black; height: 50px; ">
	<a href="/">Home</a>
    {#if session}
    <a href="">{session.user.email}</a>
    <button on:click={logout}
	type="submit">Logout</button>
    {:else if $page.url.pathname !== '/auth'}
    <button on:click={login}
	type="submit">Login</button>
    {/if}
</nav>
<slot></slot>
