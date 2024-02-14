import { Session, SignInWithPasswordCredentials, SignOut, User } from '@supabase/supabase-js'

import { Database } from '@types'
import { useSupabase } from '@utils'

export interface IAuthContext {
	signIn: (credentials: SignInWithPasswordCredentials) => void
	signOut: (options?: SignOut) => void
	user: User | null
	role: Database['public']['Enums']['user_role'] | null
}

export interface IHandleUserSessionParams {
	supabase: ReturnType<typeof useSupabase>
	session: Session | null
	setAuthState: React.Dispatch<React.SetStateAction<Pick<IAuthContext, 'role' | 'user'> | null>>
}
