import { Plus as NewIcon } from '@phosphor-icons/react'
import { Button, Space, Typography } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useNavigate } from 'react-router-dom'

import collegeMapPin from '@assets/college-map-pin.svg'
import lyceeMapPin from '@assets/lycee-map-pin.svg'
import userMapPin from '@assets/user-map-pin.svg'
import { useTheme } from '@contexts'

import { TUserLocation } from '../ContactsLayout/_components/Table/Table-types'
import { CopyableText } from '../CopyableText/CopyableText'
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

	const navigate = useNavigate()
	const location = useGeoLocation()
	const mapRef = useRef(null)
	const { theme } = useTheme()

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
			<MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
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
								<Popup className={`map-popup map-popup__${theme}`}>
									<Space direction="vertical" size="small">
										<Space direction="vertical" size={0}>
											<Typography.Text strong>{school.nom_etablissement}</Typography.Text>
											<Typography.Text type="secondary">
												{school.type_etablissement}
											</Typography.Text>
										</Space>
										<Typography.Text>
											{school.adresse_1}, {school.code_postal} {school.nom_commune}
										</Typography.Text>
										{school.telephone && <CopyableText label="Tél" text={school.telephone} />}
										{school.mail && <CopyableText label="Email" text={school.mail} />}
										<Button
											type="primary"
											className="create-btn"
											icon={<NewIcon size={16} />}
											onClick={() => {
												navigate(
													`/appointments?action=new&school_id=${school.identifiant_de_l_etablissement}`,
												)
											}}
											block
										>
											Créer un suivi
										</Button>
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
