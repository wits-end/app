import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, session, profile } }) => {
    let savedArticleIds = []

    if (profile?.articles) {
        savedArticleIds = profile.articles.map((x) => x.id)
    }

    return { articles: profile?.articles ?? [], profile, session }

};