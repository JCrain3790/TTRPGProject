<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	let input = '';
	let chatLog = [];
	let loading = false;
	let resp = 0;
	let intervalHolder;
	let campaignName = 'Campaign Assistant';
	let campaign = data.campaign;
	if (campaign && campaign.name) {
		campaignName = campaign.name;
	}
	onMount(async () => {

		if (data.startingprompt) {
			console.log(data.startingprompt);
			let jsonData = JSON.parse(data.startingprompt);
			if (jsonData.name){
				campaignName = jsonData.name;
			}
			try {
				// goto('aiassistant');
				loading = true;
				const res = await fetch('/api/start-campaign', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data.startingprompt)
				});

				const resdata = await res.json();
				console.log(resdata.choices[0]);
				chatLog = [{ role: 'assistant', content: resdata.choices[0]?.message?.content }];
				intervalHolder = typeEffect(chatLog[chatLog.length - 1].content);
				input = '';
				loading = false;
				resp = resp + 1;
				campaign.description = resdata.choices[0]?.message?.content
				let response = await fetch('/api/campaigns', {
					method: 'PATCH',
					body: JSON.stringify({
						id: campaign.id,
						description: campaign.description
					})
				})
				console.log(response)
			} catch (error) {
				console.error('Error', error);
				chatLog = [
					...chatLog,
					{ role: 'assistant', content: 'Something went wrong. Please try again.' }
				];
			}
		}
	});

	async function sendMessage() {
		if (!input) return;
		loading = true;
		typing.innerHTML = '';
		chatLog = [...chatLog, { role: 'user', content: input }];
		if (intervalHolder) {
			clearInterval(intervalHolder);
		}
		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: chatLog })
			});

			const data = await res.json();

			chatLog = [...chatLog, { role: 'assistant', content: data.choices[0]?.message?.content }];
		} catch (error) {
			console.error('Error', error);
			chatLog = [
				...chatLog,
				{ role: 'assistant', content: 'Something went wrong. Please try again.' }
			];
		}
		intervalHolder = typeEffect(chatLog[chatLog.length - 1].content);
		input = '';
		//might defer "loading = false;" to when typing finishes? depends on if you want to make the user wait or not
		loading = false;
		resp = resp + 1;
	}

	//lower is faster
	var speed = 2;
	let sentanceBreak = 10;
	/**
	 * @type {HTMLPreElement}
	 */
	let typing;
	/**
	 * @param {string} text
	 */
	function typeEffect(text) {
		typing.innerHTML = '';
		var i = 0;
		var timer = setInterval(function () {
			if (i < text.length) {
				if (sentanceBreak > 0) {
					sentanceBreak--;
				} else if (Math.random() > 0.4) {
					//skip
				} else {
					let letter = text.charAt(i++);
					typing.append(letter);
					switch (letter) {
						case '"':
						case '.':
							sentanceBreak = 25;
							break;
						case ',':
						case ':':
							sentanceBreak = 15;
					}
				}
			} else {
				clearInterval(timer);
			}
		}, speed);
		return timer;
	}
</script>

<div
	style="display: flex;
flex-direction: column;
justify-content: center;
padding-left:20%;
padding-right:20%;"
>
	<h1
		style="
display: flex;
flex-direction: row;
justify-content: center;
color: #FF9505"
	>
		{campaignName}
	</h1>
	<div
		style="height: 60vh;
    display:flex;
    flex-direction:column-reverse;"
	>
		<ul
			style="display:flex;
    flex-direction:column-reverse;
    overflow-y:scroll;
    padding-right: 34px"
			id="list"
		>
			<li>
				{#if chatLog.length > 0 && chatLog.toReversed()[0].role != 'user'}
					<span class={chatLog.toReversed()[0].role === 'user' ? 'user' : 'assistant'}>
						{chatLog.toReversed()[0].role === 'user' ? 'You' : 'Assistant'}:
					</span>
				{/if}
				<pre bind:this={typing}></pre>
			</li>

			{#each chatLog.toReversed() as message, index}
				{#if !(index == 0 && message.role != 'user')}
					<li>
						<span class={message.role === 'user' ? 'user' : 'assistant'}>
							{message.role === 'user' ? 'You' : 'Assistant'}:
						</span>
						{#if message.role === 'assistant'}
							{@html message.content}
						{:else}
							<pre>{message.content}</pre>
						{/if}
					</li>
				{/if}
			{/each}
		</ul>
	</div>
	<input
		type="text"
		bind:value={input}
		placeholder="Type your message..."
		on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		disabled={loading}
		autofocus
	/>
	<button on:click={sendMessage} disabled={loading}>
		{loading ? 'Sending...' : 'Send'}
	</button>
</div>

<style>
	pre {
		white-space: pre-wrap;
		word-wrap: break-word;
	}
	input {
		background-color: var(--eerie-black);
		color: #ffffff;
		font-size: larger;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin-bottom: 10px;
	}

	.user {
		font-weight: bold;
		color: #ec4e20;
	}

	.assistant {
		font-weight: bold;
		color: #7b9e87;
	}

	/*test*/
</style>
