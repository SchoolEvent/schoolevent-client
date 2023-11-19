import { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils/useSupabase'

import { IAuthContext } from './Auth-types'

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const supabase = useSupabase()

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null)
		})

		// Listen for changes on auth state (logged in, signed out, etc.)
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			setUser(session?.user ?? null)
			setLoading(false)
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	// Will be passed down to Signup, Login and Dashboard components
	const value: IAuthContext = useMemo(
		() => ({
			signIn: (data) => supabase.auth.signInWithPassword(data),
			signOut: () => supabase.auth.signOut(),
			user,
		}),
		[user],
	)

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export function useAuth() {
	return useContext(AuthContext)
}
