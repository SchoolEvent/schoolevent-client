export function getIsActionValid(action: string | null): action is 'new' | 'edit' | 'view' {
	if (action === null) {
		return false
	}

	return ['new', 'edit', 'view'].includes(action)
}
