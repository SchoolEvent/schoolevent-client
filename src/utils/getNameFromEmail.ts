import { capitalize } from '@utils'

export function getNameFromEmail(email: string) {
	const splittedEmail = email.split('@')

	if (splittedEmail[0].includes('.')) {
		const fullname = splittedEmail.shift()!.split('.')
		fullname[0] = capitalize(fullname[0])
		fullname[1] = capitalize(fullname[1])

		const name = fullname.join(' ')

		return { name, initials: name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0) }
	} else {
		const name = capitalize(splittedEmail[0])
		return { name, initials: name.charAt(0) }
	}
}
