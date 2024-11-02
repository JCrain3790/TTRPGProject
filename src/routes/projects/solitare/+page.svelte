<script>
	/** @type {import('./$types').PageData} */
	export let data;

	let cards = [];
	let deck;

	async function shuffle() {
		let resp = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
		let data = await resp.json();
		deck = data.deck_id;
	}

	async function drawCard(deckId, numCards) {
		let resp = await fetch(
			`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numCards ?? 5}`
		);
		let data = await resp.json();
		cards.push(...data.cards);
		cards = cards;
	}

	shuffle();
</script>

<button on:click={() => drawCard(deck, 1)}>Draw Card</button>
{#each cards as card}
	<img src={card.image} alt="" />
{/each}
