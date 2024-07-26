export const load: LayoutServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session, user, profile } = await safeGetSession()

    return {
        session,
        user,
        profile
    }
}