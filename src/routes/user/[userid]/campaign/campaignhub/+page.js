/** @type {import('../../campaignhub/$types').PageLoad} */
export async function load({url}) {
    let params = url.searchParams;
    let prompt = params.get('startingprompt');
    if (prompt) {
        url.searchParams.delete('startingprompt');
        url = url;
        return {startingprompt:prompt};
    }
    return {};
};