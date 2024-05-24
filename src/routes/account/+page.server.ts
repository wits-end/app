import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
    depends('supabase:db:articles');

    const { data: articles } = await supabase.from('articles').select()

    return { articles: articles ?? [] }
};