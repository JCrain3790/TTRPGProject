import { error, json } from '@sveltejs/kit';
import { _createFolder } from "./[campaignid]/folders/+server";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
	let name = url.searchParams.get('name');
	let id = url.searchParams.get('id');
	if (id) {
		//get specific campaign here
		const response = await locals.supabase.from('Campaigns').select('*').eq('id', id).is('deleted_at', null);
		console.log(JSON.stringify(response));
		const data = response.data;
		return json(data);
	}
	if (name) {
		//get a list of campaigns that match the name
		const response = await locals.supabase.from('Campaigns').select('*').ilike('name', `%${name}%`).is('deleted_at', null);
		const data = response.data;
		return json(data);
	}
	const response = await locals.supabase.from('Campaigns').select('*').is('deleted_at', null);
	const data = response.data;
	return json(data);
}
/**
 * @param {{ session: any; }} locals
 */
// @ts-ignore
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	let body = await request.json();
	const resp = await locals.supabase.from('Campaigns').insert(body).select();
	if (resp.error) {
		return error(503, resp.error);
	}
	let folderNames = [
		{name: 'World', icon: 'default'},
		{name: 'Lore', icon: 'default'},
		{name: 'NPCs', icon: 'default'},
		{name: 'Enemies', icon: 'default'},
		{name: 'Items', icon: 'default'},
		{name: 'Factions', icon: 'default'}
	]
	for (const o of folderNames) {
		const fresp = await _createFolder(locals.supabase, resp.data[0].id, o.name, o.icon);
		if (fresp.error) {
			console.error(fresp.error);
		}
	}
	
	return json(resp.data);
}
/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request, locals }) {
	let body = await request.json();
	console.log(body);
	if (!body.id) {
		return error(400, 'Please include a campaign id.');
	}
	const resp = await locals.supabase.from('Campaigns').upsert(body).select();
	if (resp.error) {
		console.log(resp);
		return error(503, resp.error);
	}
	return json(resp.data);
}
/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url, locals }) {
	let id = url.searchParams.get('id');
	if (id) {
		const response = await locals.supabase.from('Campaigns').update({deleted_at: new Date()}).eq('id', parseInt(id));
		const data = response.data;
		return json(data);
	}
	return error(400, 'Please include a campaign id.');
}
