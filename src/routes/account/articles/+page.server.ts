import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const { data: articles } = await supabase.from('articles').select()
    return { articles: articles ?? [] }
}