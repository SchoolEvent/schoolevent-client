import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { PropsWithChildren } from '@types'

import { TUserLocation } from '../../components/ContactsLayout/_components/Table/Table-types'
import { IMapDisplayContext, IMapDisplayState } from './MapDisplay-types'

const MapDisplayContext = createContext<IMapDisplayContext>({} as IMapDisplayContext)

export function MapDisplayProvider({ children }: PropsWithChildren) {
	const [mapDisplayState, setMapDisplayState] = useState<IMapDisplayState>({
		state: 'split',
		isHidden: true,
	})
	const [focusedPin, setFocusedPin] = useState<TUserLocation | null>(null)

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
			focusedPin,
			setFocusedPin,
		}),
		[mapDisplayState, hideMap, toggleMapState, displayMap, focusedPin],
	)

	return <MapDisplayContext.Provider value={value}>{children}</MapDisplayContext.Provider>
}

export function useMapDisplay() {
	return useContext(MapDisplayContext)
}
