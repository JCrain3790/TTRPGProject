<script>
	let input = '';
	/**
	 * @type {any[]}
	 */
	let chatLog = [];
	let loading = false;

	async function sendMessage() {
		if (!input) return;
		loading = true;

		chatLog = [...chatLog, { role: 'user', content: input }];

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: chatLog })
			});

			const data = await res.json();

			chatLog = [...chatLog, { role: 'assistant', content: data.choices[0].message.content }];
		} catch (error) {
			console.error('Error', error);
			chatLog = [
				...chatLog,
				{ role: 'assistant', content: 'Something went wrong. Please try again.' }
			];
		}

		input = '';
		loading = false;
	}

	// application
	var speed = 75;
	/**
	 * @type {HTMLLIElement}
	 */
	let li;

	function typeEffect() {
		if (li.childElementCount > 1) {
      let p = li.lastElementChild
			// @ts-ignore
			var text = p.innerHTML;
			// @ts-ignore
			p.innerHTML = '';

			var i = 0;
			var timer = setInterval(function () {
				if (i < text.length) {
					// @ts-ignore
					p.append(text.charAt(i));
					i++;
				} else {
					clearInterval(timer);
				}
			}, speed);
		}
	}
</script>

<div
	style="display: flex;
flex-direction: column;
justify-content:center;
padding-left:20%;
padding-right:20%;"
>
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
		>
			{#key typeEffect()}
				<li bind:this={li}>
					{#if chatLog.length > 0}
						<span class={chatLog.toReversed()[0].role === 'user' ? 'user' : 'assistant'}>
							{chatLog.toReversed()[0].role === 'user' ? 'You' : 'GPT'}:
						</span>
						<p>{chatLog.toReversed()[0].content}</p>
					{/if}
				</li>
			{/key}
			{#each chatLog.toReversed() as message, index}
				{#if index != 0}
					<li>
						<span class={message.role === 'user' ? 'user' : 'assistant'}>
							{message.role === 'user' ? 'You' : 'GPT'}:
						</span>
						<p>{message.content}</p>
					</li>
				{/if}
			{/each}
		</ul>
	</div>

	<!-- svelte-ignore a11y-autofocus -->
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
	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		margin-bottom: 10px;
	}

	.user {
		font-weight: bold;
		color: rgb(166, 166, 166);
	}

	.assistant {
		font-weight: bold;
		color: green;
	}

	/*test*/
</style>
