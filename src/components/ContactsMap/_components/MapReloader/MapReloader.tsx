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

	useEffect(() => {
		if (typeof userLocation[0] === 'number' && typeof userLocation[1] === 'number') {
			map.setView(userLocation, 12)
		}
	}, [userLocation, map])

	useEffect(() => {
		if (focusedPin && !mapDisplayState.isHidden) {
			map.flyTo([focusedPin.lat, focusedPin.lng], 14, { duration: 2 })
		}
	}, [focusedPin, map, mapDisplayState.isHidden])

	return null
}
