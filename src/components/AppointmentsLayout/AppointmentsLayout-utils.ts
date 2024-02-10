import { Database } from '@types'

export function getIsActionValid(action: string | null): action is 'new' | 'edit' | 'view' {
	if (action === null) {
		return false
	}

	return ['new', 'edit', 'view'].includes(action)
}

export function getIsStatusValid(
	status: string | null,
): status is Database['public']['Enums']['appointment_status'] {
	if (status === null) {
		return false
	}

	return ['to_contact', 'contacted', 'planned', 'done'].includes(status)
}
