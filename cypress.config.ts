import { defineConfig } from 'cypress'

export default defineConfig({
	defaultCommandTimeout: 10_000,
	pageLoadTimeout: 10_000,
	requestTimeout: 10_000,
	viewportWidth: 1600,
	viewportHeight: 900,
	e2e: {
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
	},
})
