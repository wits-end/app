import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
    const { data: article } = await supabase.from('articles').select(`
    id,
    title,
    authors,
    abstract,
    comments ( id, message, profile:profile_id (username) )
    `).eq('id', params.slug).single()

    return { article: article ?? [] }
}