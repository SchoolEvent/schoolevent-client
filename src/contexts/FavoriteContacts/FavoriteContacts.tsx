import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useAuth } from '@contexts'
import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import { IFavorite, IFavoriteContactsContext } from './FavoriteContacts-types'

const FavoriteContactsContext = createContext<IFavoriteContactsContext>(
	{} as IFavoriteContactsContext,
)

export function FavoriteContactsProvider({ children }: PropsWithChildren) {
	const { user } = useAuth()
	const [favorites, setFavorites] = useState<IFavorite[]>([])
	const [loading, setLoading] = useState(true)
	const supabase = useSupabase()

	const fetchFavorites = useCallback(async () => {
		if (user) {
			setLoading(true)
			const { data } = await supabase.from('favorites').select('*').eq('user_id', user.id)

			if (data) {
				setFavorites(
					data.map(({ school_city, school_name, school_postal_code, school_id }) => ({
						id: school_id,
						name: school_name,
						city: school_city,
						postalCode: school_postal_code,
					})),
				)
			} else {
				setFavorites([])
			}
		}

		setLoading(false)
	}, [supabase, user])

	useEffect(() => {
		fetchFavorites()
	}, [fetchFavorites])

	/**
	 * Deletes a favorite from the database.
	 * Refreshes the favorites list.
	 */
	const deleteFavorite = useCallback(
		async (id: string, userId: string) => {
			await supabase.from('favorites').delete().eq('user_id', userId).eq('school_id', id)
			fetchFavorites()
		},
		[supabase, fetchFavorites],
	)

	/**
	 * Adds a favorite to the database.
	 * Refreshes the favorites list.
	 */
	const addFavorite = useCallback(
		async (userId: string, favorite: IFavorite) => {
			const { id, name, city, postalCode } = favorite

			await supabase.from('favorites').insert({
				user_id: userId,
				school_id: id,
				school_name: name,
				school_city: city,
				school_postal_code: postalCode,
			})

			fetchFavorites()
		},
		[supabase, fetchFavorites],
	)

	/**
	 * Verifies if a favorite exists in the database.
	 * Returns true if it exists, false otherwise.
	 */
	const doesFavoriteExist = useCallback(
		async (id: string, userId: string) => {
			const { data } = await supabase
				.from('favorites')
				.select('*')
				.eq('user_id', userId)
				.eq('school_id', id)

			if (data && data.length > 0) {
				return true
			}

			return false
		},
		[supabase],
	)

	const value: IFavoriteContactsContext = useMemo(
		() => ({
			favorites,
			setFavorites,
			loading,
			addFavorite,
			deleteFavorite,
			doesFavoriteExist,
			refresh: fetchFavorites,
		}),
		[favorites, loading, fetchFavorites, addFavorite, deleteFavorite, doesFavoriteExist],
	)

	return (
		<FavoriteContactsContext.Provider value={value}>{children}</FavoriteContactsContext.Provider>
	)
}

export function useFavorites() {
	return useContext(FavoriteContactsContext)
}
