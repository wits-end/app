import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
    console.log(params)
    const { data: article } = await supabase.from('articles').select().eq('id', params.slug).single()

    console.log(article)
    return { article: article ?? [] }
}