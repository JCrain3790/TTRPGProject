import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

export default defineConfig({
	define: {
		'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY)
	},
	plugins: [sveltekit()],
	envDir: './environment'
});
