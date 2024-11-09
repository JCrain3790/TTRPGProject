<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

  //NEEDS RENAME, SAVE, VIEW FILES, ADD FILE TO FOLDER FUNCTIONALITY

	/** @type {import('./$types').PageData} */
	export let data;
	/**
	 * @type {any[]}
	 */
	let campaigns = [];

	onMount(() => {
		fetch('/api/campaigns').then(async (response) => {
			campaigns = await response.json();
		});
	});

	let input = '';
	let chatLog = [];
	let loading = false;

	let fileSystem = writable([
		{ type: 'folder', name: 'Campaign Ideas', children: [] },
		{ type: 'file', name: 'World Building' },
		{ type: 'file', name: 'Characters' },
		{ type: 'folder', name: 'Lore', children: [] }
	]);

	// Variables for context menu
	let showContextMenu = false;
	let contextMenuPosition = { x: 0, y: 0 };
	let selectedItem = null;

	// Functions to manage files and folders
	function addFolder(name) {
		fileSystem.update((files) => [...files, { type: 'folder', name, children: [] }]);
	}

	function addFile(name) {
		fileSystem.update((files) => [...files, { type: 'file', name }]);
	}

	function deleteItem(item) {
		fileSystem.update((files) => files.filter((file) => file !== item));
		closeContextMenu();
	}

	function duplicateItem(item) {
		fileSystem.update((files) => [...files, { ...item, name: item.name + ' Copy' }]);
		closeContextMenu();
	}

	// Function to handle right-click and show context menu
	function handleRightClick(event, item) {
		event.preventDefault();
		selectedItem = item;
		contextMenuPosition = { x: event.clientX, y: event.clientY };
		showContextMenu = true;
	}

	// Close context menu
	function closeContextMenu() {
		showContextMenu = false;
		selectedItem = null;
	}

	// Close context menu on clicking outside
	window.addEventListener('click', closeContextMenu);

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
			let assistantMessage = data.choices[0]?.message?.content || 'No response from GPT.';

			chatLog = [...chatLog, { role: 'assistant', content: assistantMessage }];
		} catch (error) {
			console.error('Error:', error);
			chatLog = [
				...chatLog,
				{ role: 'assistant', content: 'Something went wrong. Please try again.' }
			];
		}
		input = '';
		loading = false;
	}
</script>

{#each campaigns as campaign}
	<pre>{JSON.stringify(campaign)}</pre>
{/each}

<div class="container">
	<div class="sidebar">
		<h2>File System</h2>
		<div class="file-list">
			{#each $fileSystem as item}
				<button class={item.type} on:contextmenu={(e) => handleRightClick(e, item)}>
					<span>{item.name}</span>
				</button>
			{/each}
		</div>
		<div class="file-actions">
			<button on:click={() => addFolder('New Folder')}>Add Folder</button>
			<button on:click={() => addFile('New File')}>Add File</button>
		</div>
	</div>

	<div class="chat-area">
		<h1>AI Assistant</h1>
		<div class="chat-box">
			<ul>
				{#each chatLog as message, index}
					<li class={message.role === 'user' ? 'user' : 'assistant'}>
						<strong>{message.role === 'user' ? 'You' : 'GPT'}:</strong>
						<p>{@html message.content}</p>
					</li>
				{/each}
			</ul>
		</div>

		<div class="input-area">
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
	</div>

	{#if showContextMenu}
		<div
			class="context-menu"
			style="top: {contextMenuPosition.y}px; left: {contextMenuPosition.x}px"
		>
			<ul>
				<li on:click={() => deleteItem(selectedItem)}>Delete</li>
				<li on:click={() => duplicateItem(selectedItem)}>Duplicate</li>
			</ul>
		</div>
	{/if}
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
	/* Layout styling */
	.container {
		display: flex;
		height: 100vh;
	}

	.sidebar {
		width: 250px;
		background-color: var(--eerie-black);
		border-right: 1px solid #ccc;
		padding: 15px;
		display: flex;
		flex-direction: column;
	}

	.file-list {
		list-style: none;
		padding: 0;
		margin: 0;
		flex-grow: 1;
	}

	.file-item,
	.folder {
		padding: 8px 5px;
		cursor: pointer;
	}

	.file-item:hover,
	.folder:hover {
		background-color: #ddd;
	}

	.chat-area {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 20px;
		background-color: var(--eerie-black);
	}

	.chat-box {
		flex-grow: 1;
		overflow-y: auto;
		background-color: var(--eerie-black);
		padding: 15px;
		border: 1px solid #ccc;
		border-radius: 8px;
		margin-bottom: 15px;
	}

	.input-area {
		display: flex;
		gap: 10px;
	}

	input[type='text'] {
		flex: 1;
		padding: 8px;
		font-size: 1em;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	button {
		padding: 10px;
		background-color: #ff9505;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 1em;
	}

	.context-menu {
		position: absolute;
		background-color: var(--eerie-black);
		border: 1px solid #ccc;
		border-radius: 5px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		z-index: 1000;
	}

	.context-menu ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.context-menu li {
		padding: 10px;
		cursor: pointer;
	}

	.context-menu li:hover {
		background-color: #eee;
	}
</style>
