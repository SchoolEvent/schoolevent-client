import { Space } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

import collegeMapPin from '@assets/college-map-pin.svg'
import lyceeMapPin from '@assets/lycee-map-pin.svg'
import userMapPin from '@assets/user-map-pin.svg'

import { TUserLocation } from '../ContactsLayout/_components/Table/Table-types'
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

export function ContactsMap(props: IContactsMapProps) {
	const { data, setTableConfig } = props

	const location = useGeoLocation()
	const mapRef = useRef(null)

	const userLocation: TUserLocation = useMemo(
		() => ({
			lat: location.geoLocationCoordinates.lat,
			lng: location.geoLocationCoordinates.lng,
		}),
		[location],
	)

	useEffect(() => {
		setTableConfig({ type: 'SET_USER_LOCATION', payload: { location: userLocation } })
	}, [userLocation, setTableConfig])

	return (
		<MapContainer scrollWheelZoom={true} ref={mapRef}>
			<MapReloader userLocation={[userLocation.lat, userLocation.lng]} />
			<TileLayer attribution={MAP_UTILS.attribution} url={MAP_UTILS.url} />
			{location.loaded && !location.error && (
				<Marker position={userLocation} icon={userPinIcon}>
					<Popup>Vous</Popup>
				</Marker>
			)}
			<MarkerClusterGroup chunkedLoading>
				{data.map((school, i) => {
					if (school.latitude && school.longitude) {
						return (
							<Marker
								key={`${school.nom_etablissement.slice(0, 6).trim().replace(/ /g, '_')}${i}-${
									school.code_postal
								}`}
								position={[school.latitude, school.longitude]}
								icon={school.type_etablissement === 'Lycée' ? lyceePinIcon : collegePinIcon}
								title={school.nom_etablissement}
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
			</MarkerClusterGroup>
		</MapContainer>
	)
}
