/** @type {import('./$types').PageLoad} */
export async function load({url}) {
    let params = url.searchParams;
    let referrer = params.get('referrer');
    if (referrer) {
        return {referrer:referrer};
    }
    return {};
};