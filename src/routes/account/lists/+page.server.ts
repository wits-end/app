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

        const { data: [{ id }], error } = await supabase
            .from('lists')
            .insert({
                name: name,
                profile_id: profileId,
                position: position
            })
            .select();

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `create list ${id}`
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

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `delete list ${id}`
            });

        if (error) {
            console.log(error)
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

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `update list name ${listId}`
            });

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
    },
    addArticleToList: async ({ request, locals: { supabase, session } }) => {
        const { oldListId, newListId, articleId, position } = await request.json()
        const profileId = session?.user.id

        // If moving between lists
        if (oldListId) {
            const { error } = await supabase
                .from('lists_articles')
                .update({
                    list_id: newListId,
                    position: position
                })
                .eq("list_id", oldListId)
                .eq("profile_id", profileId)

            const { error: activityError } = await supabase
                .from('activity')
                .insert({
                    profile_id: profileId,
                    message: `move article to list ${articleId}`
                });

            if (error) {
                return fail(500, {
                    newListId,
                    articleId,
                })
            }


        } else {
            const { error } = await supabase
                .from('lists_articles')
                .insert({
                    list_id: newListId,
                    article_id: articleId,
                    profile_id: profileId,
                    position: position
                })
                .eq("profile_id", profileId)

            const { error: activityError } = await supabase
                .from('activity')
                .insert({
                    profile_id: profileId,
                    message: `add article to list ${articleId}`
                });

            if (error) {
                return fail(500, {
                    newListId,
                    articleId,
                })
            }


        }

        return {
            newListId,
            articleId,
        }
    },

    removeArticleFromList: async ({ request, locals: { supabase, session } }) => {
        const params = await request.formData()

        const listId = params.get("listId")
        const articleId = params.get("articleId")
        const profileId = session?.user.id

        const { error } = await supabase
            .from('lists_articles')
            .delete()
            .eq("list_id", listId)
            .eq("article_id", articleId)
            .eq("profile_id", profileId);

        const { error: activityError } = await supabase
            .from('activity')
            .insert({
                profile_id: profileId,
                message: `remove article ${articleId} from list ${listId}`
            });

        if (error) {
            console.log(error)
            return fail(500, {
                listId,
                articleId,
                profileId,
            })
        }

        return {
            listId,
            articleId,
            profileId,
        }

    }
}
export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
    let { data: profile } = await supabase
        .from('profiles')
        .select(`
            id,
            stripe_price_id, 
            stripe_current_period_end, 
            articles (
                id,
                arxiv_id,
                published_at,
                title
            ),
            lists (
                id, 
                name,
                position,
                articles (id, arxiv_id, published_at, title),
                lists_articles (position)
            )
        `)
        .eq('id', session?.user?.id)
        .single()

    // Add article position to lists
    profile?.lists?.forEach((list) => {
        for (let i = 0; i < list.articles.length; i++) {
            // We do this reassignment because we store position info in the join table but need in the actual article object
            list.articles[i].position = list.lists_articles[i].position

            // svelte dnd action uses the id field as a unique key for the foreach loops. we use ogid here to keep track of the raw id.
            list.articles[i].ogId = list.articles[i].id

            // here we ensure every article has a unique id by prepending the list id to it.
            // two of the same article can not be in the same list but the same article can be in two different lists.
            list.articles[i].id = `${list.id}:` + list.articles[i].id
        }

        list.articles.sort((a, b) => {
            return (a.position < b.position) ? -1 : 1
        })
    })


    return { articles: profile?.articles || [], lists: profile?.lists || [], profile, session }
};