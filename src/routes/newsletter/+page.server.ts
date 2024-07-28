import type { LayoutServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
    addNewsletterEmail: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData()

        const email = params.get("email")

        const { error } = await supabase
            .from('emails')
            .insert({ email: email });

        console.log(error)

        if (error) {
            return fail(500, {
                email,
            })
        }

        return {
            email,
        }
    }
}