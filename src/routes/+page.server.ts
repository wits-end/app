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



export const load: PageServerLoad = async ({ params, url, locals: { supabase, session, profile } }) => {
  const sort = url.searchParams.get('sort') || "recent";
  let articles: any;

  if (sort == "recent") {
    ({ data: articles } = await supabase.from('articles')
      .select().order('created_at', { ascending: false }))
  } else if (sort == "featured") {
    ({ data: articles } = await supabase.from('articles')
      .select().order('h_index', { ascending: false }))
  } else if (sort == "influential") {
    ({ data: articles } = await supabase.from('articles')
      .select().order('citations', { ascending: false }))
  }

  return { articles: articles ?? [], profile, session }
}