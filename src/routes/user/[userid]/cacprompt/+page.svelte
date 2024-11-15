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
	let name = writable([]);
	let header = 'Create a Campaign';
	let errorMessage = '';
	let errorState = false;
	onMount(() => {
		if (data && data.referrer) {
			if (data.referrer == 'confirmation') {
				header = 'Create your First Campaign'
			} 
		} 
	})
	// Gathers data and sends to backend
	async function startCampaign() {
		const campaignData = {
			name: $name,
			theme: $themes,
			ruleset: $rulesets,
			focus: $focus,
			scale: $scale,
			inspiration: $inspiration,
			hook: $hook
		};

		let reqbody = JSON.stringify(campaignData);
		let response = await fetch('/api/campaigns', {
			method: 'POST',
			body: JSON.stringify({name: campaignData.name})
		});
		if (!response.ok) {
			errorState = true;
			errorMessage = response.statusText;
			return;
		} 
		let responseObject = await response.json();
		console.log(responseObject);
		let id = responseObject[0].id;
		goto(`campaign/${id}/campaignhub?startingprompt=${encodeURIComponent(reqbody)}`, )
	}
	/**
	 * @type {Selector}
	 */
	let themesSelector;
	/**
	 * @type {Selector}
	 */
	let rulesetSelector;
	/**
	 * @type {Selector}
	 */
	let focusSelector;
	/**
	 * @type {Selector}
	 */
	let scaleSelector;
	/**
	 * @type {Selector}
	 */
	let inspirationSelector;
	/**
	 * @type {Selector}
	 */
	let hookSelector;
	/**
	 * 
	 * @param id{string}
	 */
	async function clearOthers(id){
		if (themesSelector.header!=id) themesSelector.clear()
		if (rulesetSelector.header!=id) rulesetSelector.clear()
		if (focusSelector.header!=id) focusSelector.clear()
		if (scaleSelector.header!=id) scaleSelector.clear()
		if (inspirationSelector.header!=id) inspirationSelector.clear()
		if (hookSelector.header!=id) hookSelector.clear()
	}
</script>

<div style="display: flex; flex-direction:column; justify-content:center; align-items:center;">
{#if errorState}
	<pre>{errorMessage}</pre>
{:else}
	<h1>{header}</h1>

	<fieldset>
		<div style="width: 100%;">
		<h2>Name</h2>
		<input type="text" bind:value={$name}>
		</div>
		<Selector on:focus={() => {clearOthers('Themes')}}
			bind:this={themesSelector}
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
				'sports'
			]}
			selections={themes}
		></Selector>
		<Selector on:focus={() => {clearOthers('Ruleset')}}
			bind:this={rulesetSelector}
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
				'Numenera'
			]}
			selections={rulesets}
		></Selector>
		<Selector on:focus={() => {clearOthers('Focus')}}
			bind:this={focusSelector}
			header="Focus"
			cannedSuggestions={['Combat', 'Roleplay', 'Investigation']}
			selections={focus}
		></Selector>
		<Selector on:focus={() => {clearOthers('Scale')}}
			bind:this={scaleSelector}
			header="Scale"
			cannedSuggestions={['World', 'Kingdom', 'City', 'Village', 'Building']}
			selections={scale}
		></Selector>

		<Selector on:focus={() => {clearOthers('Inspiration')}}
			bind:this={inspirationSelector}
			header="Inspiration"
			cannedSuggestions={['Books', 'Movies', 'Myths', 'Legends', 'Historical Events']}
			selections={inspiration}
		></Selector>

		<Selector on:focus={() => {clearOthers('Hook')}}
			bind:this={hookSelector}
			header="Hook"
			cannedSuggestions={[
				'Rescue mission',
				'Mystery to solve',
				'Treasure hunt',
				'Rebellion against tyranny',
				'Quest for power'
			]}
			selections={hook}
		></Selector>

		<button on:click={() => {startCampaign()}}>Submit Campaign</button>
	</fieldset>
	{/if}
</div>

<style>
	fieldset {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		width: 100%;
		max-width: 500px;
	}
	fieldset * {
		flex-grow: 1;
	}
	input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		width: 100%;
		max-width: 500px;
	}
</style>
