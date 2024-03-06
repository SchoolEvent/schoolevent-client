import { Session, User } from '@supabase/supabase-js'

import { Database } from '@types'
import { useSupabase } from '@utils'

export type TRole = Database['public']['Enums']['user_role']

export interface IAuthContext {
	user: User | null
	session: Session | null
	role: TRole | null
	approved: boolean
}

export interface IHandleUserSessionParams {
	supabase: ReturnType<typeof useSupabase>
	session: Session | null
	setAuthState: React.Dispatch<
		React.SetStateAction<Pick<IAuthContext, 'role' | 'user' | 'session'> | null>
	>
}
