import { BASE_URL, MANAGER_USER } from '../constants'

export function getInputFromLabel(label: string) {
	return cy.get(`label:contains("${label}")`).parent().parent().find('input')
}

export function getInputErrorFromLabel(label: string) {
	return cy.get(`label:contains("${label}")`).parent().parent().find('.ant-form-item-explain-error')
}

export function getButtonFromLabel(label: string) {
	return cy.get(`button:contains("${label}")`)
}

/**
 * Login with the given credentials or the default admin credentials.
 *
 * The second parameter is used to navigate to the login page if `true`. Default = `false`
 */
export function login(params = MANAGER_USER, shouldNavigate = false) {
	const { email, password } = params

	if (shouldNavigate) {
		cy.visit(`${BASE_URL}/login`)
	}

	getInputFromLabel('Email').type(email)
	getInputFromLabel('Mot de passe').type(password)

	getButtonFromLabel('Se connecter').click()
}

export function logout() {
	cy.get('.user-menu__dropdown').click()
	cy.contains('Déconnexion').click()
}
