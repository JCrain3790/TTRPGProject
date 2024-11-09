import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
	let name = url.searchParams.get('name') ?? '';
	console.log(name);
	const response = await locals.supabase.from('Campaigns').select('*').ilike('name', `%${name}%`);
	const data = response.data;
	console.log(data);
	return json(data);
}
/**
 * @param {{ session: any; }} locals
 */
// @ts-ignore
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	let json = await request.json();
	console.log(json);
	const session = await locals.supabase.from('Campaigns').upsert([json]).select();
	console.log(session);
	return new Response();
}
/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url, locals }) {
	let id = url.searchParams.get('id');
	if (id) {
		console.log(id);
		const response = await locals.supabase.from('Campaigns').delete().eq('id', parseInt(id));
		const data = response.data;
		console.log(data);
		return json(data);
	}
	return new Response();
}
