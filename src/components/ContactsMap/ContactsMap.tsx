// React Hooks
import 'leaflet/dist/leaflet.css'
import { useRef } from 'react'
// Leaflet
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

// Utils
import { MAP_UTILS, useGeoLocation } from './ContactsMap-utils'
import { MapReloader } from './_components/MapReloader/MapReloader'

// Style
import './ContactsMap-styles.less'

// Icon

export function ContactsMap() {
	const location = useGeoLocation()
	const mapRef = useRef(null)

	const userLocation: [number, number] = [
		location.geoLocationCoordinates.lat,
		location.geoLocationCoordinates.lng,
	]

	return (
		<MapContainer scrollWheelZoom={true} ref={mapRef}>
			<MapReloader userLocation={userLocation} />
			<TileLayer attribution={MAP_UTILS.attribution} url={MAP_UTILS.url} />
			{location.loaded && !location.error && (
				<Marker position={userLocation}>
					<Popup>Et on fait tourner les serviettes !</Popup>
				</Marker>
			)}
		</MapContainer>
	)
}
