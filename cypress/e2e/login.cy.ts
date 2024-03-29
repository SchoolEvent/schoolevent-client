import {
	APPOINTMENTS_URL,
	BASE_URL,
	CALENDAR_URL,
	CONTACTS_URL,
	DISABLED_USER,
	EVENTS_URL,
	LOGIN_URL,
	MANAGER_USER,
	SIDE_MENU_LABELS,
	STUDENT_USER,
} from '../constants'
import {
	getButtonFromLabel,
	getInputFromLabel,
	login,
	logout,
	waitForMainPageToLoad,
} from '../support/utils'

describe('Login', () => {
	it('allows to login with school email', () => {
		login(MANAGER_USER, true)
		waitForMainPageToLoad()

		cy.url().should('eq', `${BASE_URL}/`)
	})

	it('displays invalid credentials error', () => {
		cy.visit(LOGIN_URL)

		getInputFromLabel('Email').type('dummy@email.com')
		getInputFromLabel('Mot de passe').type('dummypassword')

		getButtonFromLabel('Se connecter').click()

		cy.contains('Email ou mot de passe invalide.').should('be.visible')
	})

	it('do not allow access to unapproved users', () => {
		login(DISABLED_USER, true)

		cy.contains('Accès refusé').should('be.visible')
		cy.contains("Votre compte n'est pas approuvé. Veuillez contacter votre administrateur.").should(
			'be.visible',
		)
	})

	it('displays side menu items based on user role', () => {
		// As manager
		login(MANAGER_USER, true)

		waitForMainPageToLoad()

		cy.get('.main-layout__sider').within(() => {
			SIDE_MENU_LABELS.manager.shouldHaveAccessTo.forEach((label) => {
				cy.contains(label).should('exist').and('be.visible')
			})
		})

		logout()

		// As student
		login(STUDENT_USER)

		cy.get('.main-layout__sider').within(() => {
			SIDE_MENU_LABELS.student.shouldHaveAccessTo.forEach((label) => {
				cy.contains(label).should('exist').and('be.visible')
			})

			SIDE_MENU_LABELS.student.shouldNotHaveAccessTo.forEach((label) => {
				cy.contains(label).should('not.exist')
			})
		})
	})

	it('allows access to all routes for manager role', () => {
		login(MANAGER_USER, true)

		waitForMainPageToLoad()

		// Manager should have access to contacts page
		cy.visit(CONTACTS_URL)
		cy.get('.contacts-table').should('exist').and('be.visible')

		// Manager should have access to calendar page
		cy.visit(CALENDAR_URL)
		cy.get('.events-calendar').should('exist').and('be.visible')

		// Manager should have access to appointments page
		cy.visit(APPOINTMENTS_URL)
		cy.get('.appointments-layout').should('exist').and('be.visible')

		// Manager should have access to events page
		// TODO: add assertions for the events page when it's ready
		cy.visit(EVENTS_URL)
		cy.url().should('eq', EVENTS_URL)

		// TODO: Manager should have access to students page
		// TODO: Manager should have access to stats page
	})

	it('allows access to home and events routes for student role', () => {
		login(STUDENT_USER, true)

		waitForMainPageToLoad()

		// This assertion is necessary to ensure that the login was successful.
		// If we execute the cy.visit(), it will try to navigate before the login is complete.
		cy.get('.user-menu__dropdown').should('exist').and('be.visible')

		// Student should not have access to contacts page
		cy.visit(CONTACTS_URL)
		cy.url().should('eq', `${BASE_URL}/`)

		// Student should not have access to calendar page
		cy.visit(CALENDAR_URL)
		cy.url().should('eq', `${BASE_URL}/`)

		// Student should not have access to appointments page
		cy.visit(APPOINTMENTS_URL)
		cy.url().should('eq', `${BASE_URL}/`)

		// Student should have access to events page
		// TODO: add assertions for the events page when it's ready
		cy.visit(EVENTS_URL)
		cy.url().should('eq', EVENTS_URL)

		// TODO: Admin should have access to students page
		// TODO: Admin should have access to stats page
	})
})
