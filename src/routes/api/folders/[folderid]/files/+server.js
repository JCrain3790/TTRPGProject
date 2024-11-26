import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals, params }) {
	let folderID = params.folderid;
	let fileID = url.searchParams.get('file_id');

	if (folderID) {
		const response = await locals.supabase.from('files_folder').select('*');
		const data = response.data;
		return json(data);
	}
	if (fileID) {
		const response = await locals.supabase
			.from('files_folder')
			.select('*')
			.eq('files_id', fileID);
		const data = response.data;
		return json(data);
	}

	const response = await locals.supabase.from('files_folder').select('*');
	const data = response.data;
	return json(data);
}
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	//get the body
	let body = await request.json();
	//check the body
	if (!body.folder_id) {
		return error(400, 'Request body must include folder_id.');
	}
	if (!body.file_id) {
		return error(400, 'Request body must include file_id.');
	}
	//map the body
	let fileBody = {
		folder_id: body.folder_id,
		name: body.name,
		parent_folder: body.parent_folder ?? null
	};
	//save the body
	const resp = await locals.supabase.from('files').insert(fileBody).select();
	if (resp.error) {
		return error(503, resp.error);
	}
	return json(resp.data);
}
/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request, locals }) {
    let body = await request.json();
    if (!body.id) {
		return error(400, 'Please include a file id.');
	};
    const resp = await locals.supabase.from('files').upsert(body).select();
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
		const response = await locals.supabase.from('files').delete();
		const data = response.data;
		return json(data);
	}
	return error(400, 'Please include a file id.');
}