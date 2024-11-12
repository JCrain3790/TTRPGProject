import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function POST({ request }) {
	const campaignData = JSON.parse(await request.json());
	const prompt = `
        Create a TTRPG campaign with the following details:
        - Themes: ${campaignData.theme.join(', ')}
        - Ruleset: ${campaignData.ruleset}
		- Focus: ${campaignData.focus}
		- Scale: ${campaignData.scale}
		- Inspiration: ${campaignData.inspiration}
		- Hook: ${campaignData.hook}
	`;
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [{role: 'user', content: prompt}]
		})
	});
    const aiResponse = await response.json();
    return json(aiResponse);
}
