const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // e2e options here
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
})