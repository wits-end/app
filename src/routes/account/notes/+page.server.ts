import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
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

export const load: PageServerLoad = async ({ locals: { supabase, session, profile } }) => {
    const { data: notes } = await supabase
        .from("notes")
        .select(`
            *, 
            articles (*)
        `)
        .eq("profile_id", profile?.id)

    return { notes: notes || [], profile, session }
};