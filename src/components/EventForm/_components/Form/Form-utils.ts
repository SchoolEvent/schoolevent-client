import { isStringEmpty } from '@utils'

export async function fetchAddressCompletion(
	search: string,
	location?: { lat: number; lon: number },
) {
	if (!search || isStringEmpty(search)) return null

	const response = await fetch(
		`https://api-adresse.data.gouv.fr/search/?q=${search}&limit=5${
			location ? `&lat=${location.lat}&lon=${location.lon}` : ''
		}`,
	)
	const data = await response.json()
	const addresses: string[] = []

	data.features.forEach((address: { properties: { label: string } }) => {
		addresses.push(address.properties.label)
	})

	return addresses
}

export async function fetchGeoIP() {
	const response = await fetch('http://ip-api.com/json/?fields=lat,lon')
	const data = (await response.json()) as { lat: number; lon: number }

	return data
}

export function getFilePathFromUrl(url: string) {
	return url.split('/').at(-1) as string
}
