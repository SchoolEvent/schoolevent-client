import { IHandleUserSessionParams } from './Auth-types'

export async function handleUserSession(params: IHandleUserSessionParams) {
	const { supabase, user, setAuthState } = params

	const { data } = await supabase.from('users').select().eq('id', user.id).single()

	if (data) {
		setAuthState({ user, role: data.role })
	} else {
		setAuthState(null)
	}
}
