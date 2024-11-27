<script>
	import { favoriteColor } from "$lib/stores";
</script>

<div>
	<div class="container content-left-spacing hero">
		<h1>Forge Your Next Adventure</h1>
		<p>
			Unleash your creativity with the ultimate toolkit for building immersive worlds and
			unforgettable campaigns. Dive into limitless possibilities and craft stories that captivate
			your players. With LoreForge, every idea can become a legendary tale.
		</p>
		<button type="submit" style="margin-top: 3rem;">Sign up today</button>
	</div>
	<div class="container content-center-spacing subtitle">
		<h2>Streamline and Organize</h2>
		<pre style="text-align: center;">
			Store every detail of your campaign in one place with intuitive tools designed for Game Masters of all levels. 
			Effortlessly track plotlines, world lore, and player progress all in a
			single, organized hub. Say goodbye to chaos and focus on what matters—telling your story.
		</pre>
		<button type="submit" style="margin-top: 3rem;">Sign up today</button>
	</div>
	<div class="container content-left-spacing subtitle">
		<h2>Fuel Your Imagination</h2>
		<p>
			Harness the power of AI to spark ideas, fill gaps, and expand your storytelling like never
			before. Let our AI assistant inspire your next great twist, breathe life into your NPCs, and
			keep your adventures unpredictable and engaging.
		</p>
		<button type="submit" style="margin-top: 3rem;">Sign up today</button>
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
	.container {
		display: flex;
		flex-direction: column;
		padding: 1rem; /* 20px */
		text-align: start;
	}
	.content-left-spacing {
		align-items: start;
		justify-content: start;
		margin-top: 3rem;
		margin-bottom: 10rem;
	}
	.content-center-spacing {
		padding-bottom: 10rem;
		background-color: #2c2a2a;
		align-items: center;
		justify-content: center;
	}
	.hero h1 {
		color: #e0e0e0;
		font-size: 2.5rem;
		margin: 1.5rem 0;
		font-family: 'Poppins', sans-serif;
	}
	.hero p {
		margin: 0rem;
	}
	.subtitle {
	}

	p {
		padding-right: 400px;
	}

	.messages {
		color: #adadad;
		max-width: 43.75rem; /* 700px */
		font-size: 1rem; /* 17.6px approximated as 1.1rem */
		line-height: 1.6; /* unchanged */
		margin-top: 0.625rem; /* 10px */
		font-family: 'Poppins', sans-serif;
	}
	button {
				background-color: var(--flame);
				color: #e0e0e0;
				border: 1px solid #ec4e20;
				border-radius: 4px;
				padding: 8px 24px;
				cursor: pointer;
				font-weight: bold;
				font-size: 1rem;
			}
</style>
