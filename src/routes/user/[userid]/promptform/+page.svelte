<script>
	import Selector from '$lib/Selector.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;
	let themes = writable([]);
	let rulesets = writable([]);
	let style = writable([]);

	onMount(() => {
		setInterval(() => {
			console.log($themes);
            console.log($rulesets);
		}, 2000);
	});
</script>

<pre>
    - Themes
    - Ruleset
    - Scale
    - Inspiration
    - Hook
</pre>

<Selector
	category="Themes"
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
	category="Ruleset"
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
	category="Focus"
	cannedSuggestions={[
		'Combat',
		'Roleplay',
		'Investigation',
	]}
	selections={rulesets}
></Selector>
