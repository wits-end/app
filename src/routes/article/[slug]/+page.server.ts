import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase, session }, params }) => {
    const { data: article } = await supabase.from('articles').select(`
        *
        comments ( id, message, parent_id, profile:profile_id (username) )
    `).eq('id', params.slug).single()

    const { data: relatedArticles } = await supabase.rpc('match_articles', {
        query_embedding: article?.embedding,
        match_threshold: 0.0,
        match_count: 10,
    }).neq('id', article?.id)

    return { article: article ?? {}, relatedArticles: relatedArticles ?? [] }
}