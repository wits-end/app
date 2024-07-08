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
  const sortParam = url.searchParams.get('sort') || "recent";
  const sortMap = {
    "recent": "published_at",
    "featured": "featured_at",
    "influential": "citations",
  }

  let articles: any;

  if (profile && session) {
    if (profile?.articles.length) {
      ({ data: articles } = await supabase.rpc('match_articles', {
        query_embedding: profile?.articles.map(x => JSON.parse(x.embedding))
          .reduce((acc, obj) => {
            for (let i = 0; i < 256; i++) {
              acc[i] += obj[i]
            }
            return acc
          }, new Array(256).fill(0))
          .map(x => x / profile?.articles.length),
        match_threshold: -1.0,
        match_count: 1000,
        order_by: sortParam
      }))
    }
    else {
      ({ data: articles } = await supabase.from('articles')
        .select().order(sortMap[sortParam], { ascending: false }))
    }
  }
  else {
    ({ data: articles } = await supabase.from('articles')
      .select().order(sortMap[sortParam], { ascending: false }))
  }


  return { articles: articles ?? [], profile, session }
}