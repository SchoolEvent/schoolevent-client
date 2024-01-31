import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { AppointmentModal, NewAppointmentModal } from './_components'

export function useController() {
	const [searchParams, setSearchParams] = useSearchParams()

	// Check if action type is valid
	const action = searchParams.get('action')
	const isActionValid = !!(action && ['new', 'edit', 'view'].includes(action))

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
		if (!isActionValid) {
			return null
		} else if (action !== 'new' && !isIdValid) {
			return null
		}

		switch (action) {
			case 'new':
				return <NewAppointmentModal school_id={String(school_id)} />
			default:
				return (
					<AppointmentModal appointmentId={Number(id)} mode={action === 'edit' ? 'edit' : 'view'} />
				)
		}
	}

	return { renderModal }
}
