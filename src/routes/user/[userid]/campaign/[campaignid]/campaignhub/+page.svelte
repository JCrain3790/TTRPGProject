<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { folders } from '../folders';
	import { getIcon } from '$lib/assets';
	import { FileTypes } from '$lib/enums';

	/** @type {import('./$types').PageData} */
	export let data;
	let input = '';
	/**
	 * @type {any[]}
	 */
	let chatLog = [];
	let loading = false;
	let freshLoad = false;
	let resp = 0;
	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let intervalHolder;
	let campaignName = 'Campaign Assistant';
	let campaign = data.campaign;
	let typingContent = '';
	if (campaign && campaign.name) {
		campaignName = campaign.name;
	}
	let ow;
	let sow = 0;
	let somw = () => {
		return ow * 0.9;
	};
	/**
	 * @type {HTMLDialogElement}
	 */
	let saveDialog;
	let searchTerm;

	onMount(async () => {
		if (data.startingprompt) {
			let jsonData = JSON.parse(data.startingprompt);
			if (jsonData.name) {
				campaignName = jsonData.name;
			}
			try {
				// goto('aiassistant');
				loading = true;
				const prompt = `
					Create a ${jsonData.ruleset.join(', ')} campaign ${jsonData.name ? 'called ' + jsonData.name : 'with a random name '} with the following additional details:
					- Themes: ${jsonData.theme.join(', ')}
					- Focus: ${jsonData.focus.join(', ')}
					- Scale: ${jsonData.scale.join(', ')}
					- Inspiration: ${jsonData.inspiration.join(', ')}
					- Hook: ${jsonData.hook.join(', ')}
					`;
				const res = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						messages: [{ role: 'user', content: prompt }],
						campaignID: campaign.id
					})
				});

				const resdata = await res.json();
				chatLog = [{ role: 'assistant', content: resdata.choices[0]?.message?.content }];
				intervalHolder = typeEffect(chatLog[chatLog.length - 1].content);
				input = '';
				loading = false;
				resp = resp + 1;
				campaign.description = resdata.choices[0]?.message?.content;
				let response = await fetch('/api/campaigns', {
					method: 'PATCH',
					body: JSON.stringify({
						id: campaign.id,
						description: campaign.description
					})
				});
				console.log(response);
			} catch (error) {
				console.error('Error', error);
				chatLog = [
					...chatLog,
					{ role: 'assistant', content: 'Something went wrong. Please try again.' }
				];
			}
		} else {
			loading = true;
			//1. fetch conversation from our api
			const conv = await fetch(`/api/chat?id=${campaign.id}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});
			//2. unwrap response
			const convResponse = await conv.json();
			chatLog = convResponse.map((/** @type {{ data: { role: any; content: any; }; }} */ item) => ({
				role: item.data.role,
				content: item.data.content
			}));
			chatLog = [...chatLog];
			freshLoad = true;
		}
		loading = false;
	});

	async function sendMessage() {
		if (!input) return;
		loading = true;
		typingContent = '';
		chatLog = [...chatLog, { role: 'user', content: input }];
		if (intervalHolder) {
			clearInterval(intervalHolder);
		}
		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: chatLog, campaignID: campaign.id })
			});

			const data = await res.json();

			freshLoad = false;
			let unformatted = data.choices[0]?.message?.content;
			let formatted = '';
			let insideBold = false;
			let insideItalic = false;
			for (let index = 0; index < unformatted.length; index++) {
				const element = unformatted[index];
				if (element == '*') {
					if (unformatted[index + 1] == '*') {
						if (insideBold) {
							insideBold = !insideBold;
							formatted += '</strong>';
							index = index + 1;
							continue;
						}
						insideBold = !insideBold;
						formatted += '<strong>';
						index = index + 1;
						continue;
					}
					if (insideItalic) {
						insideItalic = !insideItalic;
						formatted += '</em>';
						continue;
					}
					insideItalic = !insideItalic;
					formatted += '<em>';
					continue;
				}
				formatted += element;
			}
			console.log(formatted);
			chatLog = [...chatLog, { role: 'assistant', content: formatted }];
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
		typingContent = '';
		var i = 0;
		var timer = setInterval(function () {
			if (i < text.length) {
				if (sentanceBreak > 0) {
					sentanceBreak--;
				} else if (Math.random() > 0.4) {
					//skip
				} else {
					let letter = text.charAt(i++);
					typingContent = typingContent + letter;
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
	async function toggleSlideout() {
		if (sow == 0) {
			sow = somw();
		} else {
			sow = 0;
		}
	}
	async function openSlideout() {
		sow = somw();
	}
	async function closeSlideout() {
		sow = 0;
		if (lastFolder) {
			setTimeout(() => {
				lastFolder.style.cssText = '';
			}, 1500);
		}
	}
	let lastFolder;
	let folderData;
	async function toggleFolder(e, folder) {
		folderData = folder;

		if (lastFolder) {
			lastFolder.style.cssText = '';
		}
		e.currentTarget.style.cssText =
			'background-color: #ec4e20; margin:0px; width:120px; transition: all 500ms; border-top-right-radius:0px; border-bottom-right-radius:0px;';
		lastFolder = e.currentTarget;
	}
	let saveName;
	let saveFolder;
	let saveValue;
	let saveError = '';

	async function savePrompt() {
		//save to api
		const prompt = await fetch(`/api/campaigns/${campaign.id}/folders/${saveFolder}/files`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: saveName,
				long_description: saveValue,
				type: FileTypes.TEXT
			})
		});
		if (!prompt.ok) {
			saveError = await prompt.json();
			return;
		}
		const folderIndex = $folders.findIndex((f) => {
			return f.id == parseInt(saveFolder);
		});
		if (folderIndex > -1) {
			const file = await prompt.json();
			console.log(file);
			$folders[folderIndex].files_folder.push(file);
			$folders = $folders;
		}
		console.log($folders);
		//close dialog box
		saveDialog.close();
		//clear saveName, saveFolder, saveValue
		saveName = '';
		saveValue = '';
		saveFolder = '';
	}

	async function openPrompt(val) {
		saveName = 'Default';
		saveValue = val;
		saveDialog.showModal();
	}

	async function deletePrompt(fileID) {
		console.log(folderData);
		const folderID = folderData.id;
		const del = await fetch(
			`/api/campaigns/${campaign.id}/folders/${folderID}/files?file_id=${fileID}`,
			{
				method: 'DELETE'
			}
		);
		if (!del.ok) {
			console.log(await del.json());
			window.alert(JSON.stringify(await del.json()));
			return;
		}
		const folderIndex = $folders.findIndex((f) => {
			return f.id == parseInt(folderID);
		});
		console.log(folderIndex);
		if (folderIndex > -1) {
			console.log($folders[folderIndex].files_folder);
			$folders[folderIndex].files_folder = $folders[folderIndex].files_folder.filter((f) => {
				return f.id != fileID;
			});
			console.log($folders[folderIndex].files_folder);
			$folders = Array.from($folders);
			folderData = folderData;
		}
	}
</script>

<h1
	style="
display: flex;
flex-direction: row;
justify-content: center;
color: #FF9505"
>
	{campaignName}
</h1>
<svelte:window on:click={closeSlideout} />
<div style="display: flex; flex-direction:row; padding: 2rem;">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation style="display: flex; flex-direction: column; gap: 0.50rem;">
		{#each $folders as folder}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="folder orange-hover"
				on:click={openSlideout}
				on:click={(e) => {
					toggleFolder(e, folder);
				}}
			>
				<img src={getIcon(folder.icon)} alt="" height="25px" width="25px" />
				<p style="color: #e8eaed; margin:0px; padding:0px;">{folder.name}</p>
			</div>
		{/each}
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click|stopPropagation
		style="position: absolute; 
				transform: translateX(120px); 
				width:{sow}px; height:69vh; 
				background-color: #1f1e1e85; 
				backdrop-filter:blur(5px); 
				transition: all 1s ease-in 500ms; 
				z-index: 2;
				border:solid #ec4e20;
				border-width:4px;
				border-right-width:{sow == 0 ? 0 : 8}px;
				border-left-width:{sow == 0 ? 0 : 8}px;
				border-top-right-radius:8px;
				border-bottom-right-radius:8px;
				contain:strict;
				overflow-y: scroll;"
	>
		<div
			style="display: flex;
					justify-content:space-between;
					align-items:center"
		>
			<h2 style="margin: 8px;">{folderData ? folderData.name : ''}</h2>
			<input type="search" bind:value={searchTerm} />
			<button
				on:click={closeSlideout}
				style="display:flex; background-color: transparent; height: 28px; width: 28px; border:none; justify-content:center; align-items:center;"
			>
				<img src={getIcon('close')} alt="" height="24px" width="24px" />
			</button>
		</div>
		<div>
			{#if folderData}
				{#each folderData.files_folder as file}
					{#if !searchTerm || file.long_description
							.toLowerCase()
							.includes(searchTerm.toLowerCase())}
						<details
							style=" width: 100%; margin-bottom: .5rem; border: solid white 0px; border-bottom-width: 2px;"
						>
							<summary style="display: flex; justify-content:space-between; align-items:baseline;">
								<h3 style="display: inline; padding-left: 2rem;">{file.name}</h3>
								<div style="display: flex;">
									<button
										style="display: block; background-color: transparent; height: 28px; width: 28px; border:none; justify-content:center; align-items:center; padding-right: 1rem;"
									>
										<img src={getIcon('edit')} alt="" height="16px" width="16px" />
									</button>
									<button
										on:click={() => deletePrompt(file.id)}
										style="display: block; background-color: transparent; height: 28px; width: 28px; border:none; justify-content:center; align-items:center; padding-right: 3rem;"
									>
										<img
											src={getIcon('delete')}
											alt=""
											height="16px"
											width="16px"
											style="filter: sepia(500%) brightness(50%) saturate(600%) hue-rotate(290deg);"
										/>
									</button>
								</div>
							</summary>
							<pre
								style="background-color: #0f0f0fAA; backdrop-filter:blur(5px); padding: .5rem; padding-left: 2rem;">{file.long_description}</pre>
						</details>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
	<div
		style="display: flex;
	flex-direction: column;
	justify-content: center;"
		bind:offsetWidth={ow}
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
				id="list"
			>
				{#if chatLog.length > 0}
					<li
						style="background-color: {chatLog.toReversed()[0].role == 'user'
							? '#55555555'
							: '#27272722'}; {chatLog.toReversed()[0].role == 'user'
							? 'border-bottom-right-radius:0px; margin-left:1rem; align-self: flex-end;'
							: 'border-top-left-radius:0px; margin-right:1rem; align-self: flex-start;'};"
					>
						<span class={chatLog.toReversed()[0].role === 'user' ? 'user' : 'assistant'}>
							{chatLog.toReversed()[0].role === 'user' ? '' : 'Assistant'}
						</span>
						{#if freshLoad}
							{chatLog.toReversed()[0].content}
						{/if}
						<div
							style="white-space: pre-wrap;
								word-wrap: break-word;
								width: inherit;"
						>
							{@html typingContent}
						</div>
						<div style="display: flex; justify-content:end; margin: 1rem;">
							<button
								class="hovb"
								on:click={() => openPrompt(chatLog.toReversed()[0].content)}
								style="width:fit-content; padding:0px;"
							>
								<img src={getIcon('add')} alt="" height="24px" width="24pxpx" />
							</button>
						</div>
					</li>
				{/if}
				{#each chatLog.toReversed() as message, index}
					{#if !(index == 0 || index + 1 == chatLog.length)}
						<li
							class="hovp"
							style="background-color: {message.role == 'user'
								? '#55555555'
								: '#27272722'}; {message.role == 'user'
								? 'border-bottom-right-radius:0px; margin-left:1rem; align-self: flex-end;'
								: 'border-top-left-radius:0px; margin-right:1rem; align-self: flex-start;'}"
						>
							<span class={message.role === 'user' ? 'user' : 'assistant'}>
								{message.role === 'user' ? '' : 'Assistant'}
							</span>
							{#if message.role === 'assistant'}
								<div
									style="white-space: pre-wrap;
											word-wrap: break-word;
											width: inherit;"
								>
									{@html message.content}
								</div>
									<button class="hovb" on:click={() => openPrompt(message.content)}>+ Save</button>
							{:else}
								<div
									style="display:flex;
											flex-direction: row-reverse;"
								>
									<pre>{message.content}</pre>
								</div>
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
		/>
		<button on:click={sendMessage} disabled={loading}>
			{loading ? 'Sending...' : 'Send'}
		</button>
	</div>
</div>
<dialog
	style="height: 70vh; width: 70vw; max-width:1000px; padding:0px; background-color: transparent; border:none;"
	bind:this={saveDialog}
>
	<div
		style="height: 100%; width: 100%; background-color: var(--eerie-black); border: solid white; border-color: #ec4e20; color:antiquewhite; font-family: 'Poppins'; font-size:small; display:flex; flex-direction:column; justify-content:center; align-items: left; border-radius:1rem; padding:2rem; "
	>
		<h2>Name:</h2>
		<input type="text" bind:value={saveName} />
		<h3>Prompt:</h3>
		<textarea
			bind:value={saveValue}
			style="background-color: #0e0e0e; color: #ffffff; width: 100%; height: 70%;"
			name=""
			id=""
		></textarea>
		<h3>Location:</h3>
		<select style="background-color: var(--eerie-black); color: #ffffff;" bind:value={saveFolder}>
			{#each $folders as folder}
				<option value={folder.id}>{folder.name}</option>
			{/each}
		</select>
		<pre style="color: red; padding: 1rem;">{saveError ? JSON.stringify(saveError) : ''}</pre>
		<div style="display:flex;">
			<button
				on:click={savePrompt}
				style="width:fit-content; color: #ffffff; background-color: #ec4e20; padding:4px; margin-top: 2rem;"
				>Save</button
			>
			<button
				on:click={saveDialog.close()}
				style="width:fit-content; padding:4px; margin-top: 2rem; margin-left: 1rem;">Cancel</button
			>
		</div>
	</div>
</dialog>

<style>
	pre {
		white-space: pre-wrap;
		word-wrap: break-word;
		margin: 0px;
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
		width: fit-content;
		border-radius: 1rem;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}
	.hovp * .hovb {
		contain: strict;
		width: fit-content;
		color: #ffffff;
		background-color: #ec4e20;
		padding: 4px;
		height: 0px;
	}
	.hovp:hover * .hovb {
		width: fit-content;
		color: #ffffff;
		background-color: #ec4e20;
		padding: 4px;
	}
	.user {
		text-align: right;
		font-weight: bold;
		color: #ec4e20;
	}

	.assistant {
		font-weight: bold;
		color: #7b9e87;
	}
	.folder {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 5rem;
		width: 5rem;
		border-radius: 1rem;
		background-color: #272727;
		transition: all 200ms;
		margin-right: 40px;
	}
	.orange-hover:hover {
		background-color: #ec4e20;
		transition: all 500ms;
	}

	/*test*/
</style>
