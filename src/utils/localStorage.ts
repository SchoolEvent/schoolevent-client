import { useMemo } from 'react'
import localStorage, { Reviver } from 'store2'

import { TGetStorageReturn, TSetStorageParams, TStorageKey } from '@types'

const STORAGE_PREFIX = 'se'

/**
 * Hook version of store2. It will automatically be prefixed by 'se'
 */
export function useLocalStorage() {
	const storage = localStorage.namespace(STORAGE_PREFIX)

	return useMemo(
		() => ({
			...storage,
			set: ({ key, data }: TSetStorageParams) => {
				storage.set(key, data)
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			get: (key: TStorageKey, alt?: any | Reviver): TGetStorageReturn => storage.get(key, alt),
			has: (key: TStorageKey) => storage.has(key),
		}),
		[storage],
	)
}

/**
 * Function version of store2. It will automatically be prefixed by 'se'
 */
export function getLocalStorage() {
	const storage = localStorage.namespace(STORAGE_PREFIX)

	return {
		...storage,
		set: ({ key, data }: TSetStorageParams) => {
			storage.set(key, data)
		},
		get: (key: TStorageKey): TGetStorageReturn => storage.get(key),
		has: (key: TStorageKey) => storage.has(key),
	}
}
