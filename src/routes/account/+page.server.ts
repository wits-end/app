import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile, error } = await supabase.from('profiles').select(`id, articles ( id, title )`).eq('id', user.id).single()

    return { articles: profile.articles ?? [] }
};