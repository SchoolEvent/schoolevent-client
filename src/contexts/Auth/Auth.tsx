import { Spin } from 'antd'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import { IAuthContext } from './Auth-types'
import { handleUserSession } from './Auth-utils'

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
	const [authState, setAuthState] = useState<Pick<IAuthContext, 'user' | 'role'> | null>(null)
	const [loading, setLoading] = useState(true)
	const supabase = useSupabase()

	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			if (session?.user) {
				await handleUserSession({ supabase, user: session?.user, setAuthState })
			}
		})

		// Listen for changes on auth state (logged in, signed out, etc.)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				await handleUserSession({ supabase, user: session?.user, setAuthState })
			}

			setLoading(false)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const value: IAuthContext = useMemo(
		() => ({
			signIn: (data) => supabase.auth.signInWithPassword(data),
			signOut: () => supabase.auth.signOut(),
			user: authState?.user ?? null,
			role: authState?.role ?? null,
		}),
		[authState], // eslint-disable-line react-hooks/exhaustive-deps
	)

	return (
		<AuthContext.Provider value={value}>
			{loading ? (
				<div className="auth-loader">
					<Spin className="auth-loader__spin" size="large" />
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
