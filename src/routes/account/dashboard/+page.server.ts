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
    }
}


export const load: PageServerLoad = async ({ locals: { supabase, session, user } }) => {

    const { data: profile } = await supabase.from('profiles').select(
        '*, articles (*)').eq('id', user?.id).single()

    return { articles: profile?.articles || [], profile, session }

};