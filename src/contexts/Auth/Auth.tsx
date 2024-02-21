import { Session, User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import { IAuthContext, TRole } from './Auth-types'

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<Session | null>(null)
	const [user, setUser] = useState<User | null>(null)
	const [role, setRole] = useState<TRole | null>(null)
	const [loading, setLoading] = useState(true)
	const supabase = useSupabase()
	const navigate = useNavigate()

	useEffect(() => {
		if (role) {
			setLoading(false)
		}
	}, [role]) // eslint-disable-line react-hooks/exhaustive-deps

	useQuery({
		queryKey: ['user-role'],
		queryFn: async () => {
			const { data: userObject, error } = await supabase
				.from('users')
				.select('role')
				.eq('id', session!.user.id)
				.single()

			if (error) {
				throw error
			}

			if (userObject) {
				setRole(userObject.role)
			}

			return userObject
		},
		enabled: session !== null && role === null,
	})

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, newSession) => {
			const pathname = window.location.pathname.split('/').filter((i) => i)

			setSession(newSession)
			setUser(newSession?.user ?? null)

			if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !newSession)) {
				setRole(null)
				navigate('/login')
			} else if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && newSession)) {
				if (newSession) {
					supabase
						.from('users')
						.select('role')
						.eq('id', newSession.user.id)
						.single()
						.then(({ data: userObject }) => {
							if (userObject) {
								setRole(userObject.role)

								if (pathname.includes('login')) {
									navigate('/')
								}
							}
						})
				}
			}
		})

		const getSession = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()

			if (error) {
				throw error
			}

			if (session) {
				const { data: userObject } = await supabase
					.from('users')
					.select('role')
					.eq('id', session.user.id)
					.single()

				if (userObject) {
					setRole(userObject.role)
				}
			}

			setSession(session)
			setUser(session?.user ?? null)
			setLoading(false)
		}

		getSession()

		return () => {
			subscription.unsubscribe()
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const value: IAuthContext = useMemo(
		() => ({
			session,
			user,
			role,
		}),
		[session, user, role],
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
