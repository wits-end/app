import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
    console.log(params)
    const { data: article } = await supabase.from('articles').select(`
    id,
    title,
    authors,
    abstract,
    comments ( id, message, profile_id)
    `).eq('id', params.slug).single()

    console.log(article)
    return { article: article ?? [] }
}