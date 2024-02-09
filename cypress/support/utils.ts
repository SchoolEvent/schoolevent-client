import { createClient } from '@supabase/supabase-js'

import { Database } from '@types'

import { ADMIN_USER, BASE_URL } from '../constants'

const supabaseUrl = Cypress.env('SUPABASE_URL')
const supabaseServiceKey = Cypress.env('SUPABASE_SERVICE_KEY')

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

/**
 * WARNING: do NOT use this function in production code.
 */
export function useServiceSupabase() {
	if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing Supabase URL or Key')

	return supabase
}

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
 */
export function login(params = ADMIN_USER) {
	const { email, password } = params

	cy.visit(`${BASE_URL}/login`)

	getInputFromLabel('Email').type(email)
	getInputFromLabel('Mot de passe').type(password)

	getButtonFromLabel('Connexion').click()
}

export function logout() {
	cy.get('.user-menu__dropdown').click()
	cy.contains('Déconnexion').click()
}
