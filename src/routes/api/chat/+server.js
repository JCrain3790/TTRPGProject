import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export async function POST({ request }) {
	let reqdata = await request.json();
	console.log(reqdata.messages)

	try {
		let lastOriginalMessage = reqdata.messages.shift();
		let preamble = 'Only answer questions related to the campaign. If the message does not seem to relate to the rest of the conversation tell me to stay on topic. Question:';
		let modMessage = preamble + lastOriginalMessage.content;
		reqdata.messages.unshift({role: 'user', content: modMessage});
		const req = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${OPENAI_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: reqdata.messages
			})
		};
		console.log(req);

		const response = await fetch('https://api.openai.com/v1/chat/completions', req);

		const data = await response.json();

		console.log('Assistant Message:', data.choices[0]?.message?.content);

		if (!response.ok) {
			console.error('OpenAI API error:', data);
			return json(
				{ error: data.error.message || 'OpenAI API error.' },
				{ status: response.status }
			);
		}

		return json(data);
	} catch (error) {
		console.error('Error connecting to OpenAI:', error);
		return json({ error: 'Failed to connect to OpenAI' }, { status: 500 });
	}
	

}
