<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	/** @type {import('./$types').PageData} */
	export let data;
	/**
	 * @type {any[]}
	 */
	let campaigns = [];

	onMount(() => {
		getCampaigns();
	});

	async function getCampaigns() {
		fetch('/api/campaigns').then(async (response) => {
			campaigns = await response.json();
		});
	}
	/**
	 *
	 * @param {string}id
	 */
	async function handleDelete(id) {
		campaigns = campaigns.filter((campaign) => {
			return campaign.id !== id;
		});
		let response = await fetch(`/api/campaigns?id=${encodeURIComponent(id)}`, {
			method: 'DELETE'
		});
		if (!response.ok) {
			console.error(JSON.stringify(response));
		}
	}
</script>

<div class="content">
	<h1>Your Campaigns</h1>
	<!-- Campaign list -->

	<div class="campaign-list">
		{#if campaigns.length > 0}
			{#each campaigns as campaign}
				<div class="campaign-item">
					<h1>{campaign.name}</h1>
					<div class="button-layout">
						<button
							class="button enter-button"
							on:click={() => (window.location.href = `campaign/${campaign.id}/campaignhub`)}
						>
							Enter Campaign Hub
						</button>
						<button
							class="button delete-button"
							on:click={() => {
								handleDelete(campaign.id);
							}}>Delete Campaign</button
						>
					</div>
				</div>
			{/each}
		{:else}
			<p>No campaigns found. Start a new one below!</p>
		{/if}
	</div>
	<div class="new-campaign">
		<button
			class="button new-campaign-button"
			on:click={() => (window.location.href = 'cacprompt')}
		>
			Start a New Campaign
		</button>
	</div>
</div>

<style>
	:root {
		--eerie-black: #1f1e1e;
		--flame: #ec4e20;
		--orange: #ff9505;
		--sage: #b6be9c;
		--blue: #7b9e87;
		--background: var(--eerie-black);
	}

	body {
		background-color: var(--background);
		color: var(--sage);
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 800px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem;
		box-sizing: border-box;
	}

	h1 {
		color: var(--orange);
		margin-bottom: 1.5rem;
	}

	.campaign-list {
		width: 100%;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.campaign-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: #2d2d2d;
		border-radius: 8px;
	}

	.button-layout {
		display: flex;
		flex-direction: column;
	}

	.button {
		padding: 0.5rem 1rem;
		margin-bottom: 10px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1rem;
		color: #fff;
		transition: background-color 0.2s;
	}

	.enter-button {
		background-color: var(--blue);
	}

	.enter-button:hover {
		background-color: #4d7266;
	}

	.delete-button {
		background-color: var(--flame);
		margin: 30px;
		margin-bottom: unset;
	}

	.delete-button:hover {
		background-color: #a53817;
	}

	.new-campaign {
		margin-top: 2rem;
	}

	.new-campaign-button {
		background-color: var(--orange);
	}

	.new-campaign-button:hover {
		background-color: #cc7a04;
	}
</style>
