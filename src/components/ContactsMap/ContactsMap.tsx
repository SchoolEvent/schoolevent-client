import { Space } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import collegeMapPin from '@assets/college-map-pin.svg'
import lyceeMapPin from '@assets/lycee-map-pin.svg'
import userMapPin from '@assets/user-map-pin.svg'

import { IContactsMapProps } from './ContactsMap-types'
import { MAP_UTILS, useGeoLocation } from './ContactsMap-utils'
import { MapReloader } from './_components/MapReloader/MapReloader'

import './ContactsMap-styles.less'

const userPinIcon = L.icon({
	iconUrl: userMapPin,
	iconSize: [40, 40],
})

const lyceePinIcon = L.icon({
	iconUrl: lyceeMapPin,
	iconSize: [40, 40],
})

const collegePinIcon = L.icon({
	iconUrl: collegeMapPin,
	iconSize: [40, 40],
})

export function ContactsMap({ data }: IContactsMapProps) {
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
				<Marker position={userLocation} icon={userPinIcon}>
					<Popup>Et on fait tourner les serviettes !</Popup>
				</Marker>
			)}

			{data.map((school) => {
				console.log(school)

				if (school.latitude && school.longitude) {
					return (
						<Marker
							key={`${school.nom_etablissement.slice(0, 6).trim().replace(/ /g, '_')}-${
								school.code_postal
							}`}
							position={[school.latitude, school.longitude]}
							icon={school.type_etablissement === 'Lycée' ? lyceePinIcon : collegePinIcon}
						>
							<Popup>
								<Space direction="vertical">
									<span>{school.nom_etablissement}</span>
									<span>{school.type_etablissement}</span>
									<span>{school.adresse_1}</span>
								</Space>
							</Popup>
						</Marker>
					)
				}
			})}
		</MapContainer>
	)
}
