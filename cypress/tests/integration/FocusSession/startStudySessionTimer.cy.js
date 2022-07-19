/// <reference types="cypress" />

describe('User can search for and play music', () => {
    beforeEach(() => {
      // Visit website 
      cy.visit('http://localhost:3000')
  
      // Landing page
      cy.contains('div','studyPal')
      cy.contains('div','A productivity application to help you plan your busy days!')
      cy.get('[data-cy="greeting-img"]')
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
      cy.get('[data-cy="log-in"]').click()
  
      // Log in page 
      cy.get('[data-cy="email-input"]').type('ongyongen95@gmail.com')
      cy.get('[data-cy="password-input"]').type('blooberry95')
      cy.get('[data-cy="log-in-account"]').click()
  
      // Home Page 
      cy.get('[data-cy="home-img"]').should('be.visible')
      cy.get('[data-cy="greeting"]').should('be.visible')
      cy.get('[data-cy="upcoming-event"]').should('be.visible')
  
      // Task Tracker Page 
      cy.get('[data-cy="focus-session-header"]').click()
    })

    
  })