import { redirect } from '@sveltejs/kit';

export async function GET({ url, locals: { supabase } }) {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');
	const next = url.searchParams.get('next') ?? '/';

	/**
	 * Clean up the redirect URL by deleting the Auth flow parameters.
	 *
	 * `next` is preserved for now, because it's needed in the error case.
	 */
	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	console.log('name', next);
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');
	console.log(type, token_hash);
	if (token_hash && type) {
		const { error, data } = await supabase.auth.verifyOtp({ type, token_hash });
		if (!error) {
			redirectTo.searchParams.delete('next');
			console.log('confirmed and redirected');
			console.log('data', data);
			if (data && data.user && data.session) {
				initializeUser(data.user, data.session);
				redirect(303, `/user/${data.user.id}/cacprompt?referrer=confirmation`);
			}
		}

		redirect(303, redirectTo);
	}
	redirect(303, redirectTo);
}
async function initializeUser(user, session) {
	//New User Setup goes here
}
