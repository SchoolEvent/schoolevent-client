import { BASE_URL, LOGIN_URL, MANAGER_TEST_USER } from '../constants'
import {
	getButtonFromLabel,
	getInputErrorFromLabel,
	getInputFromLabel,
	useServiceSupabase,
} from '../support/utils'

// TODO: write tests to check that the UI adapts to the user's role
describe('Login', () => {
	const supabase = useServiceSupabase()
	supabase.auth.admin.createUser({
		email: MANAGER_TEST_USER.email,
		password: MANAGER_TEST_USER.password,
		email_confirm: true,
	})

	after(() => {
		supabase.auth.admin.listUsers().then(({ data, error }) => {
			if (error) throw error

			const testUser = data.users.find((user) => user.email === MANAGER_TEST_USER.email)

			if (!testUser) {
				throw new Error('Test user not deleted')
			}

			supabase.auth.admin.deleteUser(testUser.id)
		})
	})

	it('allows to login with school email', () => {
		cy.visit(LOGIN_URL)

		getInputFromLabel('Email').type(MANAGER_TEST_USER.email)
		getInputFromLabel('Mot de passe').type(MANAGER_TEST_USER.password)

		getButtonFromLabel('Connexion').click()

		cy.url().should('eq', `${BASE_URL}/`)
	})

	it('does not allow to login with personal email', () => {
		cy.visit(LOGIN_URL)

		getInputFromLabel('Email').type('dummy@email.com')
		getInputFromLabel('Mot de passe').type('dummypassword')

		// Whenever a user tries to log in with a personal email, the error message should be displayed
		getInputErrorFromLabel('Email').should('contain.text', 'Veuillez saisir votre email étudiant.')

		getButtonFromLabel('Connexion').should('be.disabled')
	})
})
