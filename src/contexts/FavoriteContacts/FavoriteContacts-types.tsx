import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { UseMutateFunction } from '@tanstack/react-query'

import { Database, TSupabase } from '@types'

export type TFavorite = Database['public']['Tables']['favorites']['Row']

export interface IFavoritesQueryParams {
	supabase: TSupabase
	userId: string | undefined
}

export interface IAddFavoriteParams {
	supabase: TSupabase
	favorite: Omit<TFavorite, 'id' | 'user_id'>
	userId: string | undefined
}

export interface IDeleteFavoriteParams {
	supabase: TSupabase
	school_id: string
	userId: string | undefined
}

export interface IFavoriteContactsContext {
	favorites: TFavorite[]
	loading: boolean
	/** Removes a favorite from the database. */
	removeFavorite: UseMutateFunction<PostgrestSingleResponse<null>, Error, string, unknown>
	/** Adds a favorite to the database. */
	addFavorite: UseMutateFunction<
		PostgrestSingleResponse<null>,
		Error,
		Omit<TFavorite, 'id' | 'user_id'>,
		unknown
	>
	/** Verifies if a favorite exists in the database. Returns true if it exists, false otherwise. */
	doesFavoriteExist: (id: string, userId: string) => Promise<boolean>
	refresh: () => void
}
