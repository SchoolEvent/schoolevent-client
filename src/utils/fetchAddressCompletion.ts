import { Feature, GeoCodeJSON } from '@types'
import { isStringEmpty } from '@utils'

export async function fetchAddressCompletion(
	search: string,
	location?: { lat: number; lon: number },
	postCode?: string,
) {
	if (!search || isStringEmpty(search)) return []

	const locationQuery = location ? `&lat=${location.lat}&lon=${location.lon}` : ''
	const postCodeQuery = postCode ? `&postcode=${postCode}` : ''

	const response = await fetch(
		`https://api-adresse.data.gouv.fr/search/?q=${search}&limit=5${locationQuery}${postCodeQuery}`,
	)
	const data: GeoCodeJSON = await response.json()
	const addresses: Feature['properties'][] = []

	data.features.forEach((feature) => {
		addresses.push(feature.properties)
	})

	return addresses
}
