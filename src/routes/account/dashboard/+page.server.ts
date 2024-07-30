import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
    saveArticle: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData()

        const articleId = params.get("articleId")
        const profileId = session?.user.id

        const { error } = await supabase
            .from('profiles_articles')
            .insert({ profile_id: profileId, article_id: articleId });

        console.log(error)

        if (error) {
            return fail(500, {
                articleId,
                profileId,
            })
        }

        return {
            articleId,
            profileId,
        }
    },

    unsaveArticle: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData();

        const articleId = params.get("articleId")
        const profileId = session?.user.id

        const { error } = await supabase
            .from('profiles_articles')
            .delete()
            .eq("profile_id", profileId)
            .eq("article_id", articleId);

        if (error) {
            return fail(500, {
                articleId,
                profileId,
            })
        }

        return {
            articleId,
            profileId,
        }
    },

    saveProfile: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData()

        const profileId = session?.user.id

        const firstName = params.get("first_name")
        const lastName = params.get("last_name")
        const bio = params.get("bio")

        const { data, error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                bio: bio
            })
            .eq("id", profileId)
            .select()

        console.log(error)
        console.log(data)

        if (error) {
            return fail(500, {
                error: error.message
            })
        }

        return data
    },

}


export const load: PageServerLoad = async ({ locals: { supabase, session, profile } }) => {
    return { articles: profile?.articles || [], profile, session }
};