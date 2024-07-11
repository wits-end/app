import { redirect } from '@sveltejs/kit'

import type { Actions } from '../$types'

export const actions: Actions = {
    register: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const username = formData.get('username') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { data, error } = await supabase.auth.signUp({ email, password })

        if (error) {
            console.error(error)
            return redirect(303, '/auth/error')
        } else {
            const { error } = await supabase
                .from('profiles')
                .insert({
                    id: data?.user?.id,
                    username: username,
                    email: email,
                })

            return redirect(303, '/account/dashboard')
        }
    }
}
