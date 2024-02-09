import {
	AuthError,
	AuthTokenResponse,
	SignInWithPasswordCredentials,
	SignOut,
	User,
} from '@supabase/supabase-js'

import { Database } from '@types'
import { useSupabase } from '@utils'

export interface IAuthContext {
	signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthTokenResponse>
	signOut: (options?: SignOut) => Promise<{
		error: AuthError | null
	}>
	user: User | null
	role: Database['public']['Enums']['user_role'] | null
}

export interface IHandleUserSessionParams {
	supabase: ReturnType<typeof useSupabase>
	user: User
	setAuthState: React.Dispatch<React.SetStateAction<Pick<IAuthContext, 'role' | 'user'> | null>>
}
