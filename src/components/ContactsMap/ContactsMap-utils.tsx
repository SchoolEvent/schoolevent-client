// React Hooks
import { useEffect, useState } from 'react'

// Interface
import { IGeoLocationState, IPositionError } from './ContactsMap-types'

export const MAP_UTILS = {
	url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}

export function useGeoLocation() {
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
