const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // e2e options here
    specPattern: 'cypress/tests/**/**/*.cy.{js,jsx,ts,tsx}'
  }
})