import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
  saveArticle: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()

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

  unsaveArticle: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()

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

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
  const { session } = await safeGetSession()

  const { data: articles } = await supabase.from('articles').select().order('created_at', { ascending: false })
  const { data: profile } = await supabase.from('profiles').select(`id, articles ( id, title )`).eq('id', session?.user.id).single()

  return { articles: articles ?? [], profile: profile }
}