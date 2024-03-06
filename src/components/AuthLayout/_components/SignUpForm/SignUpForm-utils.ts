import { User } from '@supabase/supabase-js'
import { NavigateFunction } from 'react-router-dom'

export function handleSuccessfulRedirect(
	user: User | null | undefined,
	navigate: NavigateFunction,
) {
	if (!user) return

	const { email } = user

	if (email) {
		const encodedEmail = encodeURIComponent(email)
		navigate(`success?email=${encodedEmail}`)
	}
}
