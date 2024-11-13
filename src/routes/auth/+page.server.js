import { redirect } from '@sveltejs/kit'

export const actions = {
  // @ts-ignore
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') + ''
    const password = formData.get('password') + ''
    console.log(formData)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error(error)
      redirect(303, `/auth/error?status=${error.status}&code=${error.code}`)
    } else {
      redirect(303, `/auth/error?message=${encodeURIComponent(`Please Confirm Your Email\n(Click the invite link we sent to your inbox!)`)}`)
    }
  },
  // @ts-ignore
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') + ''
    const password = formData.get('password') + ''

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error)
      redirect(303, `/auth/error?status=${error.status}&code=${error.code}`)
    } else {
      redirect(303, '/user/home')
    }
  },
}