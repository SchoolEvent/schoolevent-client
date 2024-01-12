export interface IMapDisplayState {
	state: 'split' | 'full'
	isHidden: boolean
}

export interface IMapDisplayContext {
	mapDisplayState: IMapDisplayState
	displayMap: () => void
	hideMap: () => void
	toggleMapState: () => void
}
