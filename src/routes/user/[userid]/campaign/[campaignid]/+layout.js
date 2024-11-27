import { error, redirect } from '@sveltejs/kit';
import { folders } from './folders';

/** @type {import('./$types').LayoutLoad} */
export async function load({params, fetch}) {
    const response = await fetch(`/api/campaigns?id=${params.campaignid}`);
    if (!response.ok) {
       return redirect(305, '/campaign'); 
    }

    const fResponse = await fetch(`/api/campaigns/${params.campaignid}/folders?campaign_id=${params.campaignid}`);
    const fData = await fResponse.json();
    folders.set(fData);
    return {campaign: (await response.json())[0]};
};