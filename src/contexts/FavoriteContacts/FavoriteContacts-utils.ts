import { IAddFavoriteParams, IDeleteFavoriteParams } from './FavoriteContacts-types'

export async function addFavorite(params: IAddFavoriteParams) {
	const { supabase, favorite, userId } = params

	if (userId === undefined) {
		throw new Error('userId is undefined')
	}

	return await supabase.from('favorites').insert({
		...favorite,
		user_id: userId,
	})
}

export async function removeFavorite(params: IDeleteFavoriteParams) {
	const { supabase, school_id, userId } = params

	if (userId === undefined) {
		throw new Error('userId is undefined')
	}

	return await supabase.from('favorites').delete().eq('school_id', school_id)
}
