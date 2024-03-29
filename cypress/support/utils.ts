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
		cy.visit(`${BASE_URL}/auth/login`)
	}

	getInputFromLabel('Email').type(email)
	getInputFromLabel('Mot de passe').type(password)

	getButtonFromLabel('Se connecter').click()
}

export function waitForMainPageToLoad() {
	cy.get('.main-layout').should('be.visible')
}

export function logout() {
	cy.get('.user-menu__dropdown').click()
	cy.contains('Déconnexion').click()
}

export function getTableColumnHeader(label: string | RegExp) {
	return cy.get('th').contains(label).parents('th')
}

/**
 * Should be used in combination with getTableColumnHeader.
 *
 * @example
 * ```ts
 * getTableColumnHeader(/$Établissement^/).within(() => {
 *  getTableColumnFilterButton().click()
 * })
 * ```
 */
export function getTableColumnFilterButton() {
	return cy.get('.ant-table-filter-trigger')
}

export function getFilterDropdown() {
	return cy.get('.ant-table-filter-dropdown')
}

export function getRadioFromLabel(label: string | RegExp) {
	return cy.get('.ant-radio-wrapper').contains(label).parents('label')
}

export function getFilterDropdownInput() {
	return getFilterDropdown().find('input')
}

export function checkTableRowsCount(count: number) {
	cy.get('.ant-table-tbody').find('tr.ant-table-row').should('have.length', count)
}

export function getAllTableRows() {
	return cy.get('.ant-table-tbody').find('tr.ant-table-row')
}

/**
 * To use when you need to wait for the table data to load.
 */
export function waitForTableDataToLoad(filtered = false) {
	cy.get('.table-container').within(() => {
		cy.get('.ant-spin-blur').should('not.exist')
	})

	if (filtered) {
		cy.get('.ant-pagination').within(() => {
			cy.get('li[title="536"]').should('not.exist')
		})
	}
}

export function getDropdownItem(label: string | RegExp) {
	return cy.get('li.ant-dropdown-menu-item').contains(label)
}

export function openMap() {
	cy.get('.open-map-btn').click()
}

export function closeMap() {
	cy.get('.close-map-btn').click()
}

export function toggleMapMode() {
	cy.get('.map-btn.toggle-mode-btn').click()
}
