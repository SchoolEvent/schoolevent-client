# Cypress Testing Guidelines

This document provides guidelines on how to write Cypress tests for this project.

## Folder Structure

The Cypress tests are located in the cypress/ directory. This directory contains the following subdirectories:

```shell
cypress
 ├── e2e  #Contains end-to-end tests
 │   └── ...
 ├── support #Contains reusable commands and utilities for tests
 │   └── ...
 ├── constants.ts #Contains constants used in the tests
 └── ...
```

## Writing Tests

Each test should be written in a separate file in the cypress/e2e/ directory. The file name should describe the feature or functionality being tested and end with .cy.ts.

Here's an example of how to structure a test:

```typescript
import { BASE_URL } from '../constants'
import { login } from '../support/utils'

describe('Feature name', () => {
	beforeEach(() => {
		// Setup code goes here
		login()
	})

	it('does something', () => {
		// Test code goes here
		cy.visit(BASE_URL)
		cy.get('.selector').should('exist')
	})
})
```

Environment Variables
Sensitive data such as API keys should be stored in environment variables, not in the test files. You can add environment variables to the `cypress.env.json` file and then access them in your tests using Cypress.env('variableName').

Example of a `cypress.env.json` file:

```json
{
	"MY_ENV_VARIABLE": "my-value"
}
```

Example of how to access the environment variable in a test:

```typescript
describe('Feature name', () => {
	it('does something', () => {
		const myEnvVariable = Cypress.env('MY_ENV_VARIABLE')
	})
})
```

## Running Tests

To run the tests, use the `cypress:open` script in the package.json file:

```bash
yarn cypress:open
```

This will open the Cypress Test Runner, where you can select and run your tests.

## Continuous Integration

Cypress tests are automatically run on every pull request and push to the master and develop branches via GitHub Actions. The configuration for this is located in `.github/workflows/cypress.yml.`
