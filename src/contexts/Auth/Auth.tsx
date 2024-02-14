import { Spin } from 'antd'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import { IAuthContext } from './Auth-types'
import { handleUserSession } from './Auth-utils'

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
	const [authState, setAuthState] = useState<Pick<IAuthContext, 'user' | 'role'> | null>(null)
	const [loading, setLoading] = useState(true)
	const supabase = useSupabase()
	const navigate = useNavigate()
	const location = useLocation()

	const pathname = location.pathname.split('/').filter((i) => i)

	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			await handleUserSession({ supabase, session, setAuthState })
		})

		// Listen for changes on auth state (logged in, signed out, etc.)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_OUT') {
				setAuthState(null)

				navigate('/login')

				setLoading(false)
			} else if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
				await handleUserSession({ supabase, session, setAuthState })

				if (pathname[0] === 'login') {
					navigate('/')
				}

				setLoading(false)
			}
		})

		return () => {
			subscription.unsubscribe()
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const value: IAuthContext = useMemo(
		() => ({
			signIn: async (data) => {
				await supabase.auth.signInWithPassword(data)
			},
			signOut: async (options) => {
				await supabase.auth.signOut(options)
			},
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
