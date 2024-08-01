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

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `save article ${articleId}`
            });

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

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `unsave article ${articleId}`
            });

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

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `save profile ${profileId}`
            });

        if (error) {
            return fail(500, {
                error: error.message
            })
        }

        console.log({
            first_name: firstName,
            last_name: lastName,
            bio: bio
        })

        return {
            first_name: firstName,
            last_name: lastName,
            bio: bio,
            success: true
        }
    },

}


export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            id,
            username,
            email,
            first_name,
            last_name,
            bio,
            stripe_price_id, 
            stripe_current_period_end, 
            articles (
                id,
                published_at,
                title,
                embedding
            )
        `)
        .eq('id', session?.user?.id)
        .single()

    const { data: activity } = await supabase
        .from('activity')
        .select('*')
        .eq("profile_id", session?.user.id)

    activity?.sort((a, b) => {
        return Date.parse(a.created_at) > Date.parse(b.created_at) ? -1 : 1
    })

    return { articles: profile?.articles || [], activity: activity || [], profile, session }
};