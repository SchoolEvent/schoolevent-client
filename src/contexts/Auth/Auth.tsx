import { Session, User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { Spin } from 'antd'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
	const location = useLocation()

	const pathname = location.pathname.split('/').filter((i) => i)

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
			console.log({ event, newSession })
			setSession(newSession)
			setUser(newSession?.user ?? null)
			setLoading(false)

			if (event === 'SIGNED_OUT') {
				console.log('SIGNED_OUT')
				navigate('/login')
			} else if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && newSession)) {
				if (pathname[0] === 'login') {
					console.log('pathname', pathname)
					navigate('/')
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
