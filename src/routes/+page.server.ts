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

const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const from = page ? page * limit : 0
  const to = page ? from + size - 1 : size - 1

  return { from, to }
}

export const load: PageServerLoad = async ({ params, url, locals: { supabase, session, profile } }) => {
  const sort = url.searchParams.get('sort') || "recent";
  const page = url.searchParams.get('page') || 0;

  const { from, to } = getPagination(page, 14);

  const { data: articles } = await supabase.from('articles').select().order('created_at', { ascending: false }).range(from, to)

  return { articles: articles ?? [], profile, session }
}