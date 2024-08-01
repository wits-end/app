import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
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
                    message: `delete note ${noteId}`
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

            const { error: updateError } = await supabase
                .from('notes')
                .update({
                    updated_at: new Date().toISOString(),
                    content: content,
                })
                .eq("id", noteId)
                .eq("profile_id", profileId)
                .eq("article_id", articleId)
                .select();

            const { error: activityError } = await supabase
                .from('activity')
                .insert({
                    profile_id: profileId,
                    message: `update note ${noteId}`
                });

            if (updateError || activityError) {
                return fail(500, {
                    articleId,
                    content,
                })
            }

            return {
                noteId,
                articleId,
                content,
                success: true,
            }
        }
    }
}

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            id,
            stripe_price_id, 
            stripe_current_period_end, 
            notes (
                id,
                article_id,
                content,
                articles (
                    id,
                    abstract,
                    published_at,
                    title
                )
            )
        `)
        .eq('id', session?.user?.id)
        .single()

    // const { data: notes } = await supabase
    //     .from("notes")
    //     .select(`
    //         *, 
    //         articles (*)
    //     `)
    //     .eq("profile_id", profile?.id)
    //     .order('created_at', { ascending: false })

    return { notes: profile?.notes || [], profile, session }
};