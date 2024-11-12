<script>
	import { goto } from '$app/navigation';
	import Selector from '$lib/Selector.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;
	let themes = writable([]);
	let rulesets = writable([]);
	let focus = writable([]);
	let scale = writable([]);
	let inspiration = writable([]);
	let hook = writable([]);

	// Gathers data and sends to backend
	async function startCampaign() {
		const campaignData = {
			theme: $themes,
			ruleset: $rulesets,
			focus: $focus,
			scale: $scale,
			inspiration: $inspiration,
			hook: $hook
		};

		try {
			const response = await fetch('/api/start-campaign', {
				method: 'POST',
				headers: { 'Content Type': 'application/json'},
				body: JSON.stringify(campaignData)
			});
			const data = await response.json();
			goto(`/aiassistant`, { state: {campaignData: data } });
		} catch (error) {
			console.error('Error starting campaign', error);
		}
	}

</script>

<h1>Create a Campaign</h1>

<form on:submit|preventDefault={startCampaign}>
<Selector
	header="Themes"
	cannedSuggestions={[
		'fantasy',
		'sci-fi',
		'horror',
		'post-apocalyptic',
		'cyberpunk',
		'superheroes',
		'historical',
		'space opera',
		'mystery',
		'steampunk',
		'wild west',
		'crime noir',
		'political intrigue',
		'survival',
		'time travel',
		'alternate history',
		'fairy tale',
		'mythology',
		'detective',
		'sports',
	]}
	selections={themes}
></Selector>
<Selector
	header="Ruleset"
	cannedSuggestions={[
		'DnD5e', 
		'DnD3.5', 
		'Savage Worlds', 
		'Pathfinder', 
		'Call of Cthulhu',
		'World of Darkness',
		'Shadowrun',
		'Cyberpunk Red',
		'Warhammer Fantasy',
		'Numenera',
	]}
	selections={rulesets}
></Selector>
<Selector
	header="Focus"
	cannedSuggestions={[
		'Combat',
		'Roleplay',
		'Investigation',
	]}
	selections={focus}
></Selector>
<Selector
		header="Scale"
		cannedSuggestions={[
			'World',
			'Kingdom',
			'City',
			'Village',
			'Building',
		]}
		selections={scale}
	></Selector>

	<Selector
		header="Inspiration"
		cannedSuggestions={[
			'Books',
			'Movies',
			'Myths',
			'Legends',
			'Historical Events',
		]}
		selections={inspiration}
	></Selector>

	<Selector
		header="Hook"
		cannedSuggestions={[
			'Rescue mission',
			'Mystery to solve',
			'Treasure hunt',
			'Rebellion against tyranny',
			'Quest for power',
		]}
		selections={hook}
	></Selector>

<button type="submit">Submit Campaign</button>
</form>
<style>
		form {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		flex-wrap: wrap;
		gap: 1rem;
	}
</style>
