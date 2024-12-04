import { FileTypes } from '$lib/enums';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals, params }) {
	let folderID = params.folderid;
	let campaignID = params.campaignid;
	let fileID = url.searchParams.get('file_id');

	const response = await locals.supabase.from('Campaigns').select(`*, folders(*, files_folder(*, files(*)))`).eq('id', campaignID);
	if(response.error) {
		return error(503, response.error);
	}
	const folderIndex = response.data[0].folders.findIndex((/** @type {{ id: string; }} */ folder) => {
		return folderID == folder.id;
	});
	if (folderIndex < 0) {
		return error(400, 'Folder does not exist');
	}
	const folder = response.data[0].folders[folderIndex];
	if (fileID) {
		const fileIndex = folder.files_folder.findIndex((/** @type {{ files: { id: string; }; }} */ file_folder) => {
			return file_folder.files.id == fileID;
		});
		if (fileIndex < 0) {
			return error(400, 'File does not exist.')
		}
		return json(folder.files_folder[fileIndex]);
	}
	return json(folder.files_folder.map((/** @type {{ files: any; }} */ e) => {
		return e.files;
	}));
}
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals, params }) {
	//get the body
	let folderID = params.folderid;
	let body = await request.json();
	//check the body
	if (!folderID) {
		return error(400, 'Folder_id not found.');
	}
	//map the body
	let fileBody = {
		name: body.name,
		short_description: body.short_description ?? null,
		long_description: body.long_description ?? null,
		type: body.type ?? FileTypes.TEXT,
		url: body.url ?? null,
		data: body.data ?? null
	};
	//save the body
	const resp = await locals.supabase.from('files').insert(fileBody).select();
	if (resp.error) {
		return error(503, resp.error);
	}
	const ffresp = await locals.supabase.from('files_folder').insert({
		folder_id: params.folderid,
		file_id: resp.data[0].id,
	})
	if (ffresp.error) {
		return error(503, ffresp.error);
	}
	return json(resp.data[0]);
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
	let fileID = url.searchParams.get('file_id');

	if (!fileID) {
		return error(400, "No file id, you idiot.");
	}
	console.log(fileID);
	const resp = await locals.supabase.from('files').delete().eq('id', parseInt(fileID));
	if (resp.error) {
		return error(503, resp.error);
	}
	return new Response(); 
}