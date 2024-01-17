import { ISchool, TSetTableConfig } from '../ContactsLayout/_components/Table/Table-types'

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

export interface IContactsMapProps {
	data: ISchool[]
	setTableConfig: TSetTableConfig
}
