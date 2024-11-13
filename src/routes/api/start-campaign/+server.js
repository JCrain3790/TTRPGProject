import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function POST({ request }) {
	const campaignData = JSON.parse(await request.json());
	const prompt = `
        Create a TTRPG campaign with the following details:
		- Name: ${campaignData.name}
        - Themes: ${campaignData.theme.join(', ')}
        - Ruleset: ${campaignData.ruleset.join(', ')}
		- Focus: ${campaignData.focus.join(', ')}
		- Scale: ${campaignData.scale.join(', ')}
		- Inspiration: ${campaignData.inspiration.join(', ')}
		- Hook: ${campaignData.hook.join(', ')}
		
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
