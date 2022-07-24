/// <reference types="cypress" />

describe('User can log in to account with the correct credentials', () => {
    beforeEach(() => {
      /* Visit website */
      cy.visit('http://localhost:3000')
  
      /* Landing page */
      cy.contains('div','studyPal')
      cy.contains('div','A productivity application to help you plan your busy days!')
      cy.get('[data-cy="greeting-img"]')
        .should('be.visible')
        .and(($img) => {
          expect($img[0].naturalWidth).to.be.greaterThan(0)
        })
      cy.get('[data-cy="log-in"]').click()
  
    })

    it('User can log in to previously created account', () => {
      /* Log in page */ 
      cy.get('[data-cy="email-input"]').type('test123@email.com')
      cy.get('[data-cy="password-input"]').type('test12345')
      cy.get('[data-cy="log-in-account"]').click()
  
      /* Home Page */
      cy.get('[data-cy="home-img"]').should('be.visible')
      cy.get('[data-cy="greeting"]').should('be.visible')
      cy.get('[data-cy="upcoming-event"]').should('be.visible')
    })

    it('User cannot log in to existing account with the wrong password', () => {
      /* Log in page */ 
      cy.get('[data-cy="email-input"]').type('test123@email.com')
      cy.get('[data-cy="password-input"]').type('test')
      cy.get('[data-cy="log-in-account"]').click()
      cy.get('[data-cy="error"]').should('have.text', 'Your login credentials are inaccurate')
    })

    it('User cannot log in to non-existent account', () => {
      /* Log in page */ 
      cy.get('[data-cy="email-input"]').type('nonexistentemail@email.com')
      cy.get('[data-cy="password-input"]').type('test12345')
      cy.get('[data-cy="log-in-account"]').click()
      cy.get('[data-cy="error"]').should('have.text', 'You do not have a registered account')
    })
})


