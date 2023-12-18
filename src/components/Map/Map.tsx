// React Hooks
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRef } from 'react'
// Leaflet
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

// Utils
import MapUtils from './Map-utils'
import { GeoLocation } from './_components/GeoLocation/GeoLocation'

// Style
import './Map-styles.less'

// Icon
//import { MapPin } from "@phosphor-icons/react";

/*
function userMarker({location: L.LatLngExpression}) {
	const map = useMap()
	if (location.loaded && !location.error) {
		map.flyTo(location, 9, { animate: true })
	}
	return location ? (
		<Marker position={location}>
			<Popup>Et on fait tourner les serviettes !</Popup>
		</Marker>
	) : null
}
*/

export default function Map() {
	const ZOOM_LEVEL = 9
	const location = GeoLocation()
	const mapRef = useRef(null)

	const userPosition: L.LatLngExpression = [
		location.geoLocationCoordinates.lat,
		location.geoLocationCoordinates.lng,
	]
	
	return (
		<>
			<MapContainer
				center={userPosition || [50, 30]}
				zoom={userPosition ? ZOOM_LEVEL : 3}
				scrollWheelZoom={true}
				ref={mapRef}
			>
				<TileLayer attribution={MapUtils.maputils.attribution} url={MapUtils.maputils.url} />
				{location.loaded && !location.error}(
					<Marker position={userPosition}>
						<Popup>Et on fait tourner les serviettes !</Popup>
					</Marker>
				)
			</MapContainer>
		</>
	)
}
