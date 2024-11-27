import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals, params }) {
	let campaignID = params.campaignid;

	const response = await locals.supabase.from('Campaigns').select(`*, folders(*, files_folder(*, files(*)))`).eq('id', campaignID);
	if(response.error) {
		return error(503, response.error);
	}
	const folders = response.data[0].folders;
	for ( const folder of folders) {
		folder.files_folder = folder.files_folder.map((/** @type {{ files: any; }} */ e) => {
			return e.files;
		})
	}
	return json(folders);
}
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	//get the body
	let body = await request.json();
	//check the body
	if (!body.campaign_id) {
		return error(400, 'Request body must include campaign_id.');
	}
	if (!body.name) {
		return error(400, 'Request body must include name.');
	}
	//map the body
	let folderBody = {
		campaign_id: body.campaign_id,
		name: body.name,
		parent_folder: body.parent_folder ?? null
	};
	//save the body
	const resp = await locals.supabase.from('folders').insert(folderBody).select();
	if (resp.error) {
		return error(503, resp.error);
	}
	return json(resp.data);
}
/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request, locals }) {
    let body = await request.json();
    if (!body.id) {
		return error(400, 'Please include a campaign id.');
	};
    const resp = await locals.supabase.from('folders').upsert(body).select();
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
		const response = await locals.supabase.from('folders').delete();
		const data = response.data;
		return json(data);
	}
	return error(400, 'Please include a campaign id.');
}
