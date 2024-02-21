import { ReactNode } from 'react'

import { useSupabase } from '@utils'

export type { Database } from './supabase'
export type TSupabase = ReturnType<typeof useSupabase>

export type PropsWithOptionalChildren<P = object> = P & { children?: ReactNode }

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export interface Feature {
	type: string
	geometry: {
		type: string
		coordinates: [number, number]
	}
	properties: {
		label: string
		score: number
		housenumber: string
		id: string
		type: string
		name: string
		postcode: string
		citycode: string
		x: number
		y: number
		city: string
		context: string
		importance: number
		street: string
	}
}

export interface GeoCodeJSON {
	type: 'FeatureCollection'
	version: string
	features: Feature[]
	attribution: string
	licence: string
	query: string
	limit: number
}

export * from './localStorage'
export * from './useCopyToClipboard'
export * from './appointments'
