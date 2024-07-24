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

    saveNotes: async ({ request, locals: { supabase, session, profile } }) => {
        const params = await request.formData()
        const content = params.get("content")

        const noteId = params.get("noteId")
        const articleId = params.get("articleId")
        const profileId = session?.user.id

        console.log({
            ...(noteId ? { id: noteId } : null),
            updated_at: new Date().toISOString(),
            profile_id: profileId,
            article_id: articleId,
            content: content,
        })

        const { error } = await supabase
            .from('notes')
            .upsert({
                ...(noteId ? { id: noteId } : null),
                updated_at: new Date().toISOString(),
                profile_id: profileId,
                article_id: articleId,
                content: content,
            })
            .eq("profile_id", profileId)
            .eq("article_id", articleId);

        if (error) {
            return fail(500, {
                articleId,
                profileId,
                content,
            })
        }

        return {
            articleId,
            profileId,
            content,
        }

    }
}

export const load: PageServerLoad = async ({ locals: { supabase, session, profile }, params }) => {
    const { data: article } = await supabase
        .from('articles')
        .select()
        .eq('id', params.slug)
        .single()

    const { data: note } = await supabase
        .from('notes')
        .select()
        .eq('profile_id', profile?.id)
        .eq('article_id', article?.id)
        .single()

    const { data: relatedArticles } = await supabase.rpc('match_articles', {
        query_embedding: article?.embedding,
        match_threshold: 0.0,
        match_count: 14,
    }).neq('id', article?.id)

    const figures = JSON.parse(article?.figures)

    return { article: article ?? {}, figures: figures || [], note: note ?? {}, relatedArticles: relatedArticles ?? [], session, profile }
}