import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import { useMapDisplay } from '@contexts'

import { IMapReloaderProps } from './MapReloader-types'

export function MapReloader(props: IMapReloaderProps) {
	const { userLocation } = props

	const { mapDisplayState, focusedPin } = useMapDisplay()
	const map = useMap()

	useEffect(() => {
		if (!mapDisplayState.isHidden) {
			map.invalidateSize()
		}
	}, [mapDisplayState, map])

	// Used to fly to the user's location when the map is displayed.
	useEffect(() => {
		if (typeof userLocation[0] === 'number' && typeof userLocation[1] === 'number') {
			!mapDisplayState.isHidden && map.flyTo(userLocation, 12, { duration: 1 })
		}
		// We are using JSON.stringify to compare the previous and current userLocation.
		// This is a hacky way to compare arrays in JavaScript.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(userLocation), map, mapDisplayState.isHidden])

	useEffect(() => {
		if (focusedPin && !mapDisplayState.isHidden) {
			map.flyTo([focusedPin.lat, focusedPin.lng], 14, { duration: 2 })
		}
	}, [focusedPin, map, mapDisplayState.isHidden])

	return null
}
