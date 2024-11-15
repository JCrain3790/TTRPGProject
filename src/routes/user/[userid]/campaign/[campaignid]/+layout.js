/** @type {import('./$types').LayoutLoad} */
export async function load({params, fetch}) {
    const response = await fetch(`/api/campaigns?id=${params.campaignid}`);
    const data = await response.json();
    return {campaign: data[0]};
};