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

export const load: PageServerLoad = async ({ locals: { supabase, session, profile }, params }) => {
    const { data: article } = await supabase.from('articles').select(`
        *
        comments ( id, message, parent_id, profile:profile_id (username) )
    `).eq('id', params.slug).single()

    const { data: relatedArticles } = await supabase.rpc('match_articles', {
        query_embedding: article?.embedding,
        match_threshold: 0.0,
        match_count: 10,
    }).neq('id', article?.id)

    return { article: article ?? {}, relatedArticles: relatedArticles ?? [], session, profile }
}