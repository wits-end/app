export const load: LayoutServerLoad = async ({ locals: { session, user, profile } }) => {

    return {
        session,
        user,
        profile
    }
}