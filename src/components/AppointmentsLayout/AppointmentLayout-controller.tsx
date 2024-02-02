import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { getIsActionValid } from './AppointmentLayout-utils'
import { AppointmentModal } from './_components'

export function useController() {
	const [searchParams, setSearchParams] = useSearchParams()

	// Check if action type is valid
	const action = searchParams.get('action')
	const isActionValid = getIsActionValid(action)

	// Check if the id is valid
	const id = searchParams.get('id')
	const isIdValid = !!(id && !Number.isNaN(Number(id)))

	// Get the school id
	const school_id = searchParams.get('school_id')

	useEffect(() => {
		// Flag to check if the search params should be updated
		let shouldUpdate = false
		let skipRest = false

		// Deletes the action from the url if it's not valid
		if (action && !isActionValid) {
			searchParams.forEach((_, key) => searchParams.delete(key))
			shouldUpdate = true
			skipRest = true
		}

		// Deletes the id from the url if it's not valid
		if (!skipRest && id && !isIdValid) {
			searchParams.delete('id')
			shouldUpdate = true
		}

		// Update the search params if needed
		if (shouldUpdate) {
			setSearchParams(searchParams)
		}
	}, [id, isIdValid, action, isActionValid, searchParams, setSearchParams])

	const renderModal = () => {
		if (!isActionValid || (action !== 'new' && !isIdValid)) {
			return null
		}

		if (action === 'view') {
			return <AppointmentModal appointmentId={id} mode={action} />
		} else if (action === 'new') {
			return <AppointmentModal schoolId={school_id} mode={action} />
		} else {
			return <AppointmentModal appointmentId={id} mode={action} />
		}
	}

	return { renderModal }
}
