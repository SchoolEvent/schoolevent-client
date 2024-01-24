import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo } from 'react'

import { useAuth } from '@contexts'
import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import { IFavorite, IFavoriteContactsContext } from './FavoriteContacts-types'
import { addFavorite, fetchFavorites, removeFavorite } from './FavoriteContacts-utils'

const FavoriteContactsContext = createContext<IFavoriteContactsContext>(
	{} as IFavoriteContactsContext,
)

export function FavoriteContactsProvider({ children }: PropsWithChildren) {
	const { user } = useAuth()
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	const {
		data: response,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['favorites', { userId: user?.id }],
		queryFn: async () => await fetchFavorites({ supabase, userId: user?.id }),
	})

	const addFav = useMutation({
		mutationFn: async (favorite: Omit<IFavorite, 'id' | 'user_id'>) =>
			await addFavorite({ favorite, supabase, userId: user?.id }),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['favorites', { userId: user?.id }] })
		},
	})

	const deleteFav = useMutation({
		mutationFn: async (school_id: string) =>
			await removeFavorite({ school_id, supabase, userId: user?.id }),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['favorites', { userId: user?.id }] })
		},
	})

	/**
	 * Verifies if a favorite exists in the database.
	 * Returns true if it exists, false otherwise.
	 */
	const doesFavoriteExist = useCallback(
		async (school_id: string, userId: string) => {
			const { data } = await supabase
				.from('favorites')
				.select('*')
				.eq('user_id', userId)
				.eq('school_id', school_id)

			if (data && data.length > 0) {
				return true
			}

			return false
		},
		[supabase],
	)

	const value: IFavoriteContactsContext = useMemo(
		() => ({
			favorites: ((response?.data ?? []) as IFavorite[]) ?? [],
			loading: isLoading,
			addFavorite: addFav.mutate,
			removeFavorite: deleteFav.mutate,
			doesFavoriteExist,
			refresh: refetch,
		}),
		[response?.data, isLoading, addFav.mutate, deleteFav.mutate, doesFavoriteExist, refetch],
	)

	return (
		<FavoriteContactsContext.Provider value={value}>{children}</FavoriteContactsContext.Provider>
	)
}

export function useFavorites() {
	return useContext(FavoriteContactsContext)
}
