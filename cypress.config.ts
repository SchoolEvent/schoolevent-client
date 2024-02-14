import { defineConfig } from 'cypress'
import { unlinkSync } from 'fs'

export default defineConfig({
	projectId: 'pccnxg',
	defaultCommandTimeout: 10_000,
	pageLoadTimeout: 10_000,
	requestTimeout: 10_000,
	viewportWidth: 1600,
	viewportHeight: 900,
	e2e: {
		setupNodeEvents(on, config) {
			on('after:spec', (_spec, results) => {
				// Do we have failures?
				if (results && results.video && results.stats.failures === 0) {
					// Delete the video if the spec passed
					unlinkSync(results.video)
				}
			})
		},
	},
})
