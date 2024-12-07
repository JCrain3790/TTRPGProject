import { redirect } from '@sveltejs/kit';

export const actions = {
    // @ts-ignore
    resetpassword: async ({ request, locals: { supabase }, session }) => {
      const formData = await request.formData()
      const password = formData.get('password') + ''
      const { error } = await supabase.auth.updateUser({ password:password })
      if (error) {
        console.error(error)
        redirect(303, `/auth/error?status=${error.status}&code=${error.code}`)
      } else {
        redirect(303, `/user/${(await supabase.auth.getSession()).data.session?.user.id}/campaign`)
      }
    },
};