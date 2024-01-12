import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { PropsWithChildren } from '@types'

import { IMapDisplayContext, IMapDisplayState } from './MapDisplay-types'

const MapDisplayContext = createContext<IMapDisplayContext>({} as IMapDisplayContext)

export function MapDisplayProvider({ children }: PropsWithChildren) {
	const [mapDisplayState, setMapDisplayState] = useState<IMapDisplayState>({
		state: 'split',
		isHidden: true,
	})

	const displayMap = useCallback(() => {
		setMapDisplayState((prevState) => ({ ...prevState, isHidden: false }))
	}, [])

	const hideMap = useCallback(() => {
		setMapDisplayState((prevState) => ({ ...prevState, isHidden: true }))
	}, [])

	const toggleMapState = useCallback(() => {
		setMapDisplayState((prevState) => ({
			state: prevState.state === 'split' ? 'full' : 'split',
			isHidden: false,
		}))
	}, [])

	const value: IMapDisplayContext = useMemo(
		() => ({
			mapDisplayState,
			displayMap,
			hideMap,
			toggleMapState,
		}),
		[mapDisplayState, hideMap, toggleMapState, displayMap],
	)

	return <MapDisplayContext.Provider value={value}>{children}</MapDisplayContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMapDisplay() {
	return useContext(MapDisplayContext)
}
