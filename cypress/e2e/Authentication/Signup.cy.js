/// <reference types="cypress" />

describe('User can sign up for a new account with the relevant credentials', () => {
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
      cy.get('[data-cy="sign-up"]').click()
  
    })

    it('User cannot sign up for an account with an already existing email', () => {
      cy.get('[data-cy="username"]').type('test123')
      cy.get('[data-cy="email"]').type('test123@email.com')
      cy.get('[data-cy="password"]').type('test12345')
      cy.get('[data-cy="confirm-password"]').type('test12345')
      cy.get('[data-cy="signup"]').click()
      cy.get('[data-cy="error"]').should('have.text', 'You already have an existing account')
    })

    it('User cannot sign up for an account with mismatched passwords', () => {
        cy.get('[data-cy="username"]').type('test123')
        cy.get('[data-cy="email"]').type('newfakeaccount@email.com')
        cy.get('[data-cy="password"]').type('test123456789')
        cy.get('[data-cy="confirm-password"]').type('test12345')
        cy.get('[data-cy="signup"]').click()
        cy.get('[data-cy="error"]').should('have.text', 'Provided passwords do not match')
    })

    it('User cannot sign up for an account with a password less than 6 letters', () => {
        cy.get('[data-cy="username"]').type('test123')
        cy.get('[data-cy="email"]').type('newfakeaccount@email.com')
        cy.get('[data-cy="password"]').type('test')
        cy.get('[data-cy="confirm-password"]').type('test')
        cy.get('[data-cy="signup"]').click()
        cy.get('[data-cy="error"]').should('have.text', 'Password should be at least 6 characters')
    })
})



/*

    it('User cannot sign up for an account with an already existing email', () => {
      /* Log in page 
      cy.get('[data-cy="email"]').type('test123@email.com')
      cy.get('[data-cy="password"]').type('test12345')
      cy.get('[data-cy="log-in-account"]').click()
  
      /* Home Page 
      cy.get('[data-cy="home-img"]').should('be.visible')
      cy.get('[data-cy="greeting"]').should('be.visible')
      cy.get('[data-cy="upcoming-event"]').should('be.visible')
    })

  */
