import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

import { useMapDisplay } from '@contexts'

export function MapReloader() {
	const { mapDisplayState } = useMapDisplay()
	const map = useMap()

	useEffect(() => {
		if (!mapDisplayState.isHidden) {
			map.invalidateSize()
		}
	}, [mapDisplayState, map])

	return null
}
