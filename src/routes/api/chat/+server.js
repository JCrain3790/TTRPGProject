import { json } from '@sveltejs/kit';
import fetch from 'node-fetch';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export async function POST({ request, locals }) {
	let reqdata = await request.json();
	const campaignID = reqdata.campaignID;

	try {
		let lastOriginalMessage = reqdata.messages.pop();
		saveMessage(lastOriginalMessage, campaignID, locals.supabase);
		//let preamble = 'Only answer questions related to the campaign. If the message does not seem to relate to the rest of the conversation tell me to stay on topic. However, be open to casual questions even if the word "campaign" is not used. Question:';
		//let preamble = 'Answer my next question in the context of this campaign, if you are unable to answer the question as it relates to the campaign then please tell me to stay on topic. Question: '
		let preamble = ''
		if (reqdata.messages.length < 1) {
			preamble = ''
		}
		let modMessage = preamble + lastOriginalMessage.content;
		reqdata.messages.push({role: 'user', content: modMessage});
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


		const response = await fetch('https://api.openai.com/v1/chat/completions', req);

		const data = await response.json();


		saveMessage(data.choices[0].message, campaignID, locals.supabase);

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
	/**
	 * 
	 * @param {any} message 
	 * @param {string} campaignID 
	 * @param {any} supabase 
	 */
	async function saveMessage(message, campaignID, supabase) {
		const respdata = await supabase.from('Chat').insert([{data: message, campaign: campaignID}]).select();
		if (respdata.error){
			console.error(respdata.error, 'Message not saved');
		} 

	}

}
export async function GET({ url, locals }) {
	let id = url.searchParams.get('id');
	if (id) {
		//get specific campaign here
		const response = await locals.supabase.from('Chat').select('*').eq('campaign', id).order('id', {ascending: true});
		console.log(JSON.stringify(response));
		const data = response.data;
		return json(data);
	}
}
