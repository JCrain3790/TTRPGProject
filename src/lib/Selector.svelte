<script>
	export let cannedSuggestions;
	export let category;
    export let selections;
    

    let suggestions = []

    let items = new Set()

    
    /**
	 * @type {any}
	 */
    let input

    async function handleInputchange(){
        if(!input) {
            suggestions = [];
            return;
        }
        console.log(input)
        suggestions = cannedSuggestions.filter((cs) => {
            return cs.toLowerCase().includes(input.toLowerCase());
        } )
    }

    async function handleAddClick(item){
        if(!item) return;
        items.add(item)
        items = items
        console.log(items)
        $selections = Array.from(items)
    }

    async function handleRemoveClick(item){
        if(!item) return;
        items.delete(item)
        items = items
        console.log(items)
        $selections = Array.from(items)
    }

    
</script>

<h2>{category}</h2>
<input bind:value={input} on:input={() => handleInputchange()} type="text" />
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
