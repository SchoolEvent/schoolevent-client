import { TUserLocation } from '../../components/ContactsLayout/_components/Table/Table-types'

export interface IMapDisplayState {
	state: 'split' | 'full'
	isHidden: boolean
}

export interface IMapDisplayContext {
	mapDisplayState: IMapDisplayState
	displayMap: () => void
	hideMap: () => void
	toggleMapState: () => void
	focusedPin: TUserLocation | null
	setFocusedPin: React.Dispatch<React.SetStateAction<TUserLocation | null>>
}
