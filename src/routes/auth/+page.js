/** @type {import('./$types').PageLoad} */
export async function load({url}) {
    let params = url.searchParams;
    let signUp = params.get('signUp')?true:false;
    return {signUp:signUp};
};