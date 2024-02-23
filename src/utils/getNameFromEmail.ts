import { capitalize } from '@utils'

export function getNameFromEmail(email: string) {
	const splittedEmail = email.split('@')

	if (splittedEmail[0].includes('.')) {
		const fullname = splittedEmail.shift()!.split('.')
		fullname[0] = capitalize(fullname[0])

		if (fullname[1].includes('-')) {
			const lastname: string[] = []
			// Split the lastname by '-' and capitalize each part
			fullname[1].split('-').forEach((substr) => lastname.push(capitalize(substr)))

			fullname[1] = lastname.join(' ')
		} else {
			fullname[1] = fullname[1].toUpperCase()
		}

		const name = fullname.join(' ')

		return { name, initials: name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0) }
	} else {
		const name = capitalize(splittedEmail[0])
		return { name, initials: name.charAt(0) }
	}
}
