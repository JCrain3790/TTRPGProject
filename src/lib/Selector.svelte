<svelte:options accessors />
<script>
	import { createEventDispatcher } from "svelte";

	/**
     * @type {string[]}
     */
    export let cannedSuggestions = [];
	export let header;
	export let selections;
    export let placeholderText = '';
    export let allowCustomResponse = true;
    export async function clear(){
        input = '';
        handleInputchange();
    };

    /**
     * @type {string[]}
     */
	let suggestions = [];

	let items = new Set();

	/**
	 * @type {any}
	 */
	let input;

	async function handleInputchange() {
		if (!input) {
			suggestions = [];
			return;
		}
		suggestions = cannedSuggestions.filter((cs) => {
			return cs.toLowerCase().includes(input.toLowerCase());
		});
        if (allowCustomResponse) {
            suggestions.push(input);
        }
	}

    /**
     * @param item{string}
     */
	async function handleAddClick(item) {
		if (!item) return;
		items.add(item);
		items = items;
		$selections = Array.from(items);
        cannedSuggestions = cannedSuggestions.filter((cs) => {
            return item != cs;
        })
        suggestions = suggestions.filter((cs) => {
            return item != cs;
        })
	}
    /**
     * @param item{string}
     */
	async function handleRemoveClick(item) {
		if (!item) return;
		items.delete(item);
		items = items;
		$selections = Array.from(items);
        cannedSuggestions.push(item);
        cannedSuggestions = cannedSuggestions;
        handleInputchange();
	}
    
    async function focuss(){
        dispatch('focus');
    }

    let dispatch = createEventDispatcher();

</script>

<div >
<h2>{header}</h2>
<input on:focus={focuss} placeholder={placeholderText} bind:value={input} on:input={() => handleInputchange()} type="text" />
<ul>
	{#each Array.from(items) as cs}
		<button on:click={() => handleRemoveClick(cs)}>- {cs}</button>
	{/each}
</ul>
<ul>
	{#each suggestions as cs}
		<button on:click={() => handleAddClick(cs)}>+ {cs}</button>
	{/each}
</ul>
</div>
<style>
    div {
        width: 100%;

    }
    input {
        width: 100%;
    }
    ul {
        margin: 0%;
        padding: 0%;
    }
    button {
        margin: 5px;
    }
</style>
