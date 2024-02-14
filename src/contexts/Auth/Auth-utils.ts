import { IHandleUserSessionParams } from './Auth-types'

export async function handleUserSession(params: IHandleUserSessionParams) {
	const { supabase, session, setAuthState } = params

	if (!session) {
		setAuthState(null)
		return
	}

	const { data } = await supabase.from('users').select().eq('id', session.user.id).single()

	if (data) {
		setAuthState({ user: session.user, role: data.role })
	} else {
		setAuthState(null)
	}
}
