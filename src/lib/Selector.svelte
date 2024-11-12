<script>
	/**
     * @type {string[]}
     */
    export let cannedSuggestions = [];
	export let header;
	export let selections;
    export let placeholderText = '';
    export let allowCustomResponse = true;

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
		console.log(input);
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
		console.log(items);
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
		console.log(items);
		$selections = Array.from(items);
        cannedSuggestions.push(item);
        cannedSuggestions = cannedSuggestions;
        handleInputchange();
	}
</script>

<h2>{header}</h2>
<input placeholder={placeholderText} bind:value={input} on:input={() => handleInputchange()} type="text" />
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

