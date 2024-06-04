import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession()

    const { data: profile } = await supabase.from('profiles').select(`id, articles ( id, title )`).eq('id', session?.user.id).single()
    const savedArticleIds = profile?.articles.map((x) => x.id)


    return { articles: profile.articles ?? [], savedArticleIds: savedArticleIds ?? [] }

};