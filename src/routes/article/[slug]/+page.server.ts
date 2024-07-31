import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'


export const actions: Actions = {
    saveArticle: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData()

        const articleId = params.get("articleId")
        const profileId = session?.user.id

        const { error: insertError } = await supabase
            .from('profiles_articles')
            .insert({ profile_id: profileId, article_id: articleId });

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `saved article ${articleId}`
            });

        if (insertError || activityError) {
            return fail(500, {
                articleId,
            })
        }

        return {
            articleId,
        }
    },

    unsaveArticle: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData();

        const articleId = params.get("articleId")
        const profileId = session?.user.id

        const { error: deleteError } = await supabase
            .from('profiles_articles')
            .delete()
            .eq("profile_id", profileId)
            .eq("article_id", articleId);

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `unsaved article ${articleId}`
            });

        if (deleteError || activityError) {
            return fail(500, {
                articleId,
            })
        }

        return {
            articleId,
        }
    },

    saveNotes: async ({ request, locals: { supabase, session, profile } }) => {
        const params = await request.formData()
        const content = params.get("content")

        const noteId = params.get("noteId")
        const articleId = params.get("articleId")
        const profileId = session?.user.id

        if (!content && noteId) {
            const { error: deleteError } = await supabase
                .from('notes')
                .delete()
                .eq("id", noteId)
                .eq("profile_id", profileId)
                .eq("article_id", articleId)

            const { error: activityError } = await supabase
                .from('activity')
                .insert({
                    profile_id: profileId,
                    message: `deleted note ${noteId}`
                });

            if (deleteError || activityError) {
                return fail(500, {
                    articleId,
                    content,
                })
            }

            return {
                articleId,
                content,
                success: true,
            }
        } else if (content) {
            console.log({
                ...(noteId ? { id: noteId } : null),
                updated_at: new Date().toISOString(),
                profile_id: profileId,
                article_id: articleId,
                content: content,
            })

            const { data: [{ id }], error: upsertError } = await supabase
                .from('notes')
                .upsert({
                    ...(noteId ? { id: noteId } : null),
                    updated_at: new Date().toISOString(),
                    profile_id: profileId,
                    article_id: articleId,
                    content: content,
                })
                .eq("profile_id", profileId)
                .eq("article_id", articleId)
                .select();

            const { error: activityError } = await supabase
                .from('activity')
                .insert({
                    profile_id: profileId,
                    message: `upserted note ${id}`
                });

            if (upsertError || activityError) {
                return fail(500, {
                    articleId,
                    content,
                })
            }

            return {
                noteId: id,
                articleId,
                content,
                success: true,
            }
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
        match_threshold: 0.25,
        match_count: 14,
        order_by: "similarity",
    }).neq('id', article?.id)

    const figures = JSON.parse(article?.figures).sort((a, b) => {
        return a.page > b.page ? 1 : -1
    })

    return {
        article: article ?? {},
        figures: figures || [],
        note: note ?? {},
        relatedArticles: relatedArticles ?? [],
        profile,
        session
    }
}