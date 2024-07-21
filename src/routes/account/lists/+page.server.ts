import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { LexoRank } from "lexorank";

export const actions: Actions = {
    createList: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData()

        const profileId = session?.user.id

        const name = params.get("name")
        const previousRank = params.get("previousRank")

        let position: string;

        if (previousRank) {
            position = LexoRank.parse(previousRank).genNext().toString();
        } else {
            position = LexoRank.middle().toString();
        }

        const { error } = await supabase
            .from('lists')
            .insert({
                name: name,
                profile_id: profileId,
                position: position
            });

        console.log(error)

        if (error) {
            return fail(500, {
                name,
                position,
                profileId,
            })
        }

        return {
            name,
            position,
            profileId,
        }
    },
    deleteList: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData();

        const id = params.get("id")
        const profileId = session?.user.id

        const { error } = await supabase
            .from('lists')
            .delete()
            .eq("id", id)
            .eq("profile_id", profileId);

        if (error) {
            return fail(500, {
                id,
                profileId,
            })
        }

        return {
            id,
            profileId,
        }
    },
    updateListName: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData();

        console.log("server submit update name")

        const listId = params.get('listId')
        const name = params.get('name')

        const profileId = session?.user.id

        const { error } = await supabase
            .from('lists')
            .update({
                name: name,
            })
            .eq("id", listId)
            .eq("profile_id", profileId);

        if (error) {
            return fail(500, {
                listId,
                name,
            })
        }

        return {
            listId,
            name,
        }
    }
}
export const load: PageServerLoad = async ({ locals: { supabase, session, profile } }) => {
    // const { data: profile } = await supabase.from('profiles').select(
    //     '*, articles (*)').eq('id', user?.id).single()

    const { data: lists } = await supabase
        .from("lists")
        .select(`
            *,
            articles (*),
            lists_articles (position)
        `)
        .eq("profile_id", profile?.id)

    // Add article position to lists
    lists?.forEach((list) => {
        for (let i = 0; i < list.articles.length; i++) {
            list.articles[i].position = list.lists_articles[i].position
        }
    })

    return { articles: profile?.articles || [], lists: lists || [], profile, session }
};