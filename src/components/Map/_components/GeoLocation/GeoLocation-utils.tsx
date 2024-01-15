// React Hooks
import { useEffect, useState } from 'react'

// Interface
import { IGeoLocationState, IPositionError } from './GeoLocation-types'

export function GeoLocation() {
	const [location, setLocation] = useState<IGeoLocationState>({
		loaded: false,
		geoLocationCoordinates: { lat: 0, lng: 0 },
		error: null,
	})

	const onSuccess = (location: { coords: { latitude: number; longitude: number } }) => {
		setLocation({
			loaded: true,
			geoLocationCoordinates: {
				lat: location.coords.latitude,
				lng: location.coords.longitude,
			},
			error: null,
		})
	}

	const onError = (error: IPositionError) => {
		setLocation({
			loaded: true,
			geoLocationCoordinates: { lat: 0, lng: 0 },
			error,
		})
	}

	useEffect(() => {
		if (!('geolocation' in navigator)) {
			onError({
				code: 0,
				message: 'Geolocation not supported',
			})
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError)
	}, [])

	return location
}
