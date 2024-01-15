export interface IGeoLocationCoordinates {
	lat: number
	lng: number
}

export interface IPositionError {
	code: number
	message: string
}

export interface IGeoLocationState {
	loaded: boolean
	geoLocationCoordinates: IGeoLocationCoordinates
	error: IPositionError | null
}
